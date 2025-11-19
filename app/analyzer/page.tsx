'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  TextField,
  Paper,
  Grid,
  Alert,
  CircularProgress,
  Tabs,
  Tab,
  Divider,
  Chip,
} from '@mui/material';
import {
  Analytics as AnalyticsIcon,
  AutoAwesome as AIIcon,
  Shield as ShieldIcon,
  CheckCircle as CheckIcon,
} from '@mui/icons-material';
import FileUpload from '@/components/analyzer/FileUpload';
import AnalysisResults from '@/components/analyzer/AnalysisResults';
import SuggestionsSidebar from '@/components/analyzer/SuggestionsSidebar';
import { analyzeResume, AnalysisResult } from '@/lib/analyzer';
import {
  canMakeRequest,
  recordRequest,
  getRemainingRequests,
  getTimeUntilNextRequest,
} from '@/lib/rateLimit';
import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';

// PDF worker
if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.js';
}

// Declare captcha global
declare global {
  interface Window {
    grecaptcha: any;
  }
}

interface AIFeedback {
  summary: string;
  bulletSuggestions: string[];
  improvedSummary?: string;
}

export default function AnalyzerPage() {
  const [tabValue, setTabValue] = useState(0);
  const [resumeText, setResumeText] = useState('');
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [aiFeedback, setAIFeedback] = useState<AIFeedback | null>(null);
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAILoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [captchaLoading, setCaptchaLoading] = useState(false);

  useEffect(() => {
    const verified = localStorage.getItem('cq_captcha_verified') === 'true';
    setCaptchaVerified(verified);
  }, []);

  // Enterprise reCAPTCHA verification
  const verifyCaptcha = async () => {
    if (!process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY) {
      setError('reCAPTCHA Enterprise is not configured.');
      return false;
    }

    setCaptchaLoading(true);
    setError(null);

    try {
      if (!window.grecaptcha) {
        throw new Error('reCAPTCHA failed to load. Refresh and try again.');
      }

      const token = await window.grecaptcha.enterprise.execute(
        process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY,
        { action: 'resume_verification' }
      );

      const response = await fetch('/api/verify-captcha', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          action: 'resume_verification',
        }),
      });

      const data = await response.json();

      if (!data.ok) {
        throw new Error('Captcha verification failed');
      }

      localStorage.setItem('cq_captcha_verified', 'true');
      setCaptchaVerified(true);
      return true;
    } catch (err: any) {
      console.error('Captcha error:', err);
      setError(err.message || 'Captcha failed. Try again.');
      return false;
    } finally {
      setCaptchaLoading(false);
    }
  };

  // PDF + DOCX extractors
  const extractTextFromPDF = async (file: File) => {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let fullText = '';

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      fullText += content.items.map((i: any) => i.str).join(' ') + '\n';
    }

    return fullText;
  };

  const extractTextFromDocx = async (file: File) => {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value;
  };

  const handleFileSelect = async (file: File) => {
    if (!captchaVerified) {
      const verified = await verifyCaptcha();
      if (!verified) return;
    }

    setLoading(true);
    setError(null);
    setFileName(file.name);

    try {
      let text = '';
      if (file.type === 'application/pdf') {
        text = await extractTextFromPDF(file);
      } else if (file.name.endsWith('.docx')) {
        text = await extractTextFromDocx(file);
      } else {
        throw new Error('Unsupported file format');
      }

      setResumeText(text);
      const analysisResult = await analyzeResume(text);
      setAnalysis(analysisResult);
    } catch {
      setError('Failed to process file. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleTextAnalyze = async () => {
    if (!resumeText.trim()) {
      setError('Enter or paste resume text first.');
      return;
    }
    setLoading(true);
    try {
      const analysisResult = await analyzeResume(resumeText);
      setAnalysis(analysisResult);
    } catch {
      setError('Failed to analyze resume.');
    } finally {
      setLoading(false);
    }
  };

  const handleAIReview = async () => {
    if (!captchaVerified) {
      const verified = await verifyCaptcha();
      if (!verified) return;
    }

    const rateLimitCheck = canMakeRequest();
    if (!rateLimitCheck.allowed) {
      setError(rateLimitCheck.reason || 'Rate limit exceeded');
      return;
    }

    if (!resumeText.trim()) {
      setError('Upload a resume or paste text first.');
      return;
    }

    setAILoading(true);
    setError(null);

    try {
      const response = await fetch('/api/analyze-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeText }),
      });

      if (!response.ok) throw new Error('AI analysis failed');

      const data = await response.json();
      setAIFeedback(data);
      recordRequest();
    } catch (err: any) {
      setError(err.message || 'AI Review failed');
    } finally {
      setAILoading(false);
    }
  };

  const remainingRequests = getRemainingRequests();
  const timeUntilNext = getTimeUntilNextRequest();

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="xl">
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between' }}>
          <Box>
            <Typography variant="h4" fontWeight={700}>
              Resume Analyzer
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Get instant feedback on your resume with AI-powered insights
            </Typography>
          </Box>

          {captchaVerified && (
            <Chip icon={<CheckIcon />} label="Verified" color="success" variant="outlined" />
          )}
        </Box>

        {!captchaVerified && (
          <Alert severity="info" sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2">
                Please verify to upload files and use AI features
              </Typography>
              <Button
                variant="contained"
                size="small"
                startIcon={
                  captchaLoading ? <CircularProgress size={16} /> : <ShieldIcon />
                }
                onClick={verifyCaptcha}
                disabled={captchaLoading}
              >
                {captchaLoading ? 'Verifying...' : 'Verify Now'}
              </Button>
            </Box>
          </Alert>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        <Grid container spacing={3}>
          {/* Left Column */}
          <Grid item xs={12} lg={5}>
            <Paper sx={{ p: 3, mb: 3 }}>
              <Tabs value={tabValue} onChange={(_, v) => setTabValue(v)} sx={{ mb: 3 }}>
                <Tab label="Upload File" />
                <Tab label="Paste Text" />
              </Tabs>

              {tabValue === 0 ? (
                <FileUpload onFileSelect={handleFileSelect} onTextPaste={setResumeText} />
              ) : (
                <>
                  <TextField
                    fullWidth
                    multiline
                    rows={12}
                    value={resumeText}
                    onChange={(e) => setResumeText(e.target.value)}
                    label="Paste resume text"
                  />
                  <Button
                    variant="contained"
                    fullWidth
                    sx={{ mt: 2 }}
                    disabled={loading || !resumeText.trim()}
                    onClick={handleTextAnalyze}
                    startIcon={loading ? <CircularProgress size={20} /> : <AnalyticsIcon />}
                  >
                    {loading ? 'Analyzing...' : 'Analyze Resume'}
                  </Button>
                </>
              )}
            </Paper>

            {/* AI Review */}
            {analysis && (
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6">AI-Powered Review</Typography>
                <Typography variant="body2" color="text.secondary" mb={2}>
                  Get deeper, AI-driven suggestions and improvements.
                </Typography>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="caption" color="text.secondary">
                    {remainingRequests} requests remaining today
                  </Typography>
                  {timeUntilNext > 0 && (
                    <Typography variant="caption" color="text.secondary">
                      Next in {timeUntilNext}s
                    </Typography>
                  )}
                </Box>

                <Button
                  variant="contained"
                  fullWidth
                  disabled={aiLoading || timeUntilNext > 0}
                  onClick={handleAIReview}
                  startIcon={aiLoading ? <CircularProgress size={20} /> : <AIIcon />}
                >
                  {aiLoading ? 'Analyzing...' : 'Run AI Review'}
                </Button>

                {aiFeedback && (
                  <Box mt={3}>
                    <Alert severity="info">
                      <Typography variant="subtitle2" fontWeight={600}>
                        AI Feedback
                      </Typography>
                      <Typography variant="body2" mt={1}>
                        {aiFeedback.summary}
                      </Typography>

                      {aiFeedback.bulletSuggestions.length > 0 && (
                        <>
                          <Divider sx={{ my: 2 }} />
                          <Typography fontWeight={600}>Bullet Suggestions:</Typography>
                          <ul>
                            {aiFeedback.bulletSuggestions.map((b, idx) => (
                              <li key={idx}>
                                <Typography variant="body2">{b}</Typography>
                              </li>
                            ))}
                          </ul>
                        </>
                      )}

                      {aiFeedback.improvedSummary && (
                        <>
                          <Divider sx={{ my: 2 }} />
                          <Typography fontWeight={600}>Improved Summary:</Typography>
                          <Typography variant="body2" fontStyle="italic">
                            {aiFeedback.improvedSummary}
                          </Typography>
                        </>
                      )}
                    </Alert>
                  </Box>
                )}
              </Paper>
            )}
          </Grid>

          {/* Right Column */}
          <Grid item xs={12} lg={7}>
            {!analysis && !loading && (
              <Paper sx={{ p: 8, textAlign: 'center' }}>
                <AnalyticsIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" color="text.secondary">
                  Upload or paste to begin
                </Typography>
              </Paper>
            )}

            {loading && (
              <Paper sx={{ p: 8, textAlign: 'center' }}>
                <CircularProgress size={60} />
                <Typography variant="h6" color="text.secondary" mt={2}>
                  Analyzing…
                </Typography>
              </Paper>
            )}

            {analysis && !loading && (
              <Grid container spacing={3}>
                <Grid item xs={12} lg={7}>
                  <AnalysisResults analysis={analysis} />
                </Grid>
                <Grid item xs={12} lg={5}>
                  <SuggestionsSidebar suggestions={analysis.suggestions} />
                </Grid>
              </Grid>
            )}
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
