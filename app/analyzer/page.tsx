'use client';

import { useState, useEffect, useCallback } from 'react';
import mammoth from 'mammoth';
import pdfParse from 'pdf-parse';

interface AnalysisResult {
  summary: string;
  suggestions: string[];
  rewrittenSummary: string;
}

// Rate limit constants
const STORAGE_KEY_LAST_RUN = 'careerquill_ai_last_run';
const STORAGE_KEY_DAILY_COUNT = 'careerquill_ai_daily_count';
const STORAGE_KEY_COUNT_DATE = 'careerquill_ai_count_date';

export default function AnalyzerPage() {
  const [resumeText, setResumeText] = useState('');
  const [fileName, setFileName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [recaptchaReady, setRecaptchaReady] = useState(false);

  // Rate limiting state
  const [cooldownRemaining, setCooldownRemaining] = useState(0);
  const [dailyCount, setDailyCount] = useState(0);
  const [maxPerDay] = useState(
    parseInt(process.env.NEXT_PUBLIC_RATE_LIMIT_MAX_PER_DAY || '5')
  );
  const [cooldownSeconds] = useState(
    parseInt(process.env.NEXT_PUBLIC_RATE_LIMIT_COOLDOWN_SECONDS || '30')
  );

  // Check if reCAPTCHA is loaded
  useEffect(() => {
    const checkRecaptcha = () => {
      if (typeof window !== 'undefined' && (window as any).grecaptcha) {
        (window as any).grecaptcha.ready(() => {
          setRecaptchaReady(true);
        });
      } else {
        // Retry after a short delay
        setTimeout(checkRecaptcha, 100);
      }
    };
    checkRecaptcha();
  }, []);

  // Load rate limit data from localStorage
  const loadRateLimitData = useCallback(() => {
    if (typeof window === 'undefined') return;

    const today = new Date().toDateString();
    const storedDate = localStorage.getItem(STORAGE_KEY_COUNT_DATE);

    // Reset count if it's a new day
    if (storedDate !== today) {
      localStorage.setItem(STORAGE_KEY_COUNT_DATE, today);
      localStorage.setItem(STORAGE_KEY_DAILY_COUNT, '0');
      setDailyCount(0);
    } else {
      const count = parseInt(localStorage.getItem(STORAGE_KEY_DAILY_COUNT) || '0');
      setDailyCount(count);
    }

    // Check cooldown
    const lastRun = parseInt(localStorage.getItem(STORAGE_KEY_LAST_RUN) || '0');
    const now = Date.now();
    const timeSinceLastRun = Math.floor((now - lastRun) / 1000);

    if (timeSinceLastRun < cooldownSeconds) {
      setCooldownRemaining(cooldownSeconds - timeSinceLastRun);
    }
  }, [cooldownSeconds]);

  useEffect(() => {
    loadRateLimitData();
  }, [loadRateLimitData]);

  // Countdown timer for cooldown
  useEffect(() => {
    if (cooldownRemaining > 0) {
      const timer = setInterval(() => {
        setCooldownRemaining((prev) => {
          if (prev <= 1) {
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [cooldownRemaining]);

  // Handle file upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError('');
    setFileName(file.name);

    try {
      if (file.type === 'application/pdf') {
        const arrayBuffer = await file.arrayBuffer();
        const data = await pdfParse(Buffer.from(arrayBuffer));
        setResumeText(data.text);
      } else if (
        file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ) {
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        setResumeText(result.value);
      } else if (file.type === 'text/plain') {
        const text = await file.text();
        setResumeText(text);
      } else {
        setError('Unsupported file type. Please upload PDF, DOCX, or TXT file.');
      }
    } catch (err) {
      setError('Failed to read file. Please try again.');
      console.error('File read error:', err);
    }
  };

  // Execute reCAPTCHA and get token
  const getRecaptchaToken = async (): Promise<string | null> => {
    try {
      const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
      if (!siteKey) {
        setError('reCAPTCHA is not configured');
        return null;
      }

      const token = await (window as any).grecaptcha.execute(siteKey, {
        action: 'resume_ai_critique',
      });

      return token;
    } catch (err) {
      setError('reCAPTCHA verification failed. Please refresh the page.');
      console.error('reCAPTCHA error:', err);
      return null;
    }
  };

  // Handle AI analysis
  const handleAnalyze = async () => {
    setError('');
    setAnalysis(null);

    // Validate resume text
    const cleanedText = resumeText.trim();
    if (!cleanedText) {
      setError('Please enter or upload your resume text.');
      return;
    }

    if (cleanedText.length < 50) {
      setError('Resume text is too short. Please provide at least 50 characters.');
      return;
    }

    // Check client-side rate limits
    if (dailyCount >= maxPerDay) {
      setError(`Daily limit of ${maxPerDay} analyses reached. Please try again tomorrow.`);
      return;
    }

    if (cooldownRemaining > 0) {
      setError(`Please wait ${cooldownRemaining} seconds before analyzing again.`);
      return;
    }

    // Get reCAPTCHA token
    setIsLoading(true);
    const recaptchaToken = await getRecaptchaToken();

    if (!recaptchaToken) {
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/analyze-resume', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          resumeText: cleanedText,
          recaptchaToken,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 429) {
          setError(data.error || 'Rate limit exceeded. Please try again later.');
        } else if (response.status === 403) {
          setError('Verification failed. Please try again.');
        } else {
          setError(data.error || 'Analysis failed. Please try again.');
        }
        return;
      }

      // Update rate limit data
      const now = Date.now();
      localStorage.setItem(STORAGE_KEY_LAST_RUN, now.toString());

      const newCount = dailyCount + 1;
      localStorage.setItem(STORAGE_KEY_DAILY_COUNT, newCount.toString());
      setDailyCount(newCount);
      setCooldownRemaining(cooldownSeconds);

      // Set analysis result
      setAnalysis(data.analysis);

    } catch (err) {
      setError('Network error. Please check your connection and try again.');
      console.error('Analysis error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const canAnalyze =
    recaptchaReady &&
    !isLoading &&
    cooldownRemaining === 0 &&
    dailyCount < maxPerDay &&
    resumeText.trim().length >= 50;

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-4xl font-bold mb-2 text-center">Resume Analyzer</h1>
      <p className="text-gray-600 dark:text-gray-400 text-center mb-8">
        Get AI-powered feedback to improve your resume
      </p>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Left Column - Input */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4">Upload or Paste Resume</h2>

            {/* File Upload */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Upload File (PDF, DOCX, or TXT)
              </label>
              <input
                type="file"
                accept=".pdf,.docx,.txt"
                onChange={handleFileUpload}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100 cursor-pointer"
              />
              {fileName && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                  Loaded: {fileName}
                </p>
              )}
            </div>

            {/* Text Area */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Or Paste Resume Text
              </label>
              <textarea
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                placeholder="Paste your resume text here..."
                rows={15}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
              <p className="text-sm text-gray-500 mt-1">
                {resumeText.trim().length} characters
              </p>
            </div>

            {/* Rate Limit Info */}
            <div className="mt-4 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <p className="text-sm text-gray-700 dark:text-gray-300">
                <strong>Usage:</strong> {dailyCount} of {maxPerDay} analyses used today
              </p>
              {cooldownRemaining > 0 && (
                <p className="text-sm text-orange-600 dark:text-orange-400 mt-1">
                  Cooldown: {cooldownRemaining} seconds remaining
                </p>
              )}
            </div>

            {/* Error Display */}
            {error && (
              <div className="mt-4 p-4 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 rounded-lg">
                <p className="text-red-700 dark:text-red-400">{error}</p>
              </div>
            )}

            {/* Analyze Button */}
            <button
              onClick={handleAnalyze}
              disabled={!canAnalyze}
              className={`w-full mt-6 py-3 px-6 rounded-lg font-semibold transition-colors ${
                canAnalyze
                  ? 'bg-primary-600 hover:bg-primary-700 text-white cursor-pointer'
                  : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
              }`}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Analyzing...
                </span>
              ) : cooldownRemaining > 0 ? (
                `Wait ${cooldownRemaining}s`
              ) : dailyCount >= maxPerDay ? (
                'Daily Limit Reached'
              ) : !recaptchaReady ? (
                'Loading reCAPTCHA...'
              ) : (
                'Analyze with AI'
              )}
            </button>

            {!recaptchaReady && (
              <p className="text-xs text-gray-500 text-center mt-2">
                Waiting for reCAPTCHA to load...
              </p>
            )}
          </div>
        </div>

        {/* Right Column - Results */}
        <div className="space-y-6">
          {analysis ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold mb-4 text-green-600 dark:text-green-400">
                Analysis Results
              </h2>

              {/* Critique Summary */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Critique</h3>
                <div className="prose dark:prose-invert max-w-none">
                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                    {analysis.summary}
                  </p>
                </div>
              </div>

              {/* Suggestions */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Suggestions for Improvement</h3>
                <ul className="space-y-2">
                  {analysis.suggestions.map((suggestion, index) => (
                    <li
                      key={index}
                      className="flex items-start text-gray-700 dark:text-gray-300"
                    >
                      <span className="text-primary-600 mr-2 mt-1">•</span>
                      <span>{suggestion}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Rewritten Summary */}
              <div>
                <h3 className="text-lg font-semibold mb-2">Rewritten Professional Summary</h3>
                <div className="p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg border border-primary-200 dark:border-primary-800">
                  <p className="text-gray-700 dark:text-gray-300">
                    {analysis.rewrittenSummary}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold mb-4">Analysis Results</h2>
              <p className="text-gray-500 dark:text-gray-400 text-center py-12">
                Your analysis results will appear here after you click "Analyze with AI"
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Footer Note */}
      <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
        <p>
          This service is protected by reCAPTCHA and rate limiting to ensure fair usage.
        </p>
        <p className="mt-1">
          All resume data is processed securely and not stored permanently.
        </p>
      </div>
    </div>
  );
}
