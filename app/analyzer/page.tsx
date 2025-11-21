'use client';

import React, { useState } from 'react';
import Script from 'next/script'; // <--- NEW: Optimized script loader
import {
  Box,
  Container,
  Typography,
  Button,
  TextField,
  Paper,
  Alert,
  CircularProgress,
  Tabs,
  Tab,
  Divider,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import {
  Analytics as AnalyticsIcon,
  AutoAwesome as AIIcon,
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

// Configure PDF.js worker with local file
if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.js';
}

// Declare grecaptcha for TypeScript
declare global {
  interface Window {
    grecaptcha: {
      enterprise: {
        ready: (cb: () => void) => void;
        execute: (siteKey: string, options: { action: string }) => Promise<string>;
      };
    };
  }
}

/* ============================================================
    Recaptcha Helper
   ============================================================ */
async function verifyRecaptcha(action: string): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!window.grecaptcha?.enterprise) {
      console.error('reCAPTCHA Enterprise not available on window');
      reject(new Error('reCAPTCHA not loaded'));
      return;
    }

    window.grecaptcha.enterprise.ready(async () => {
      try {
        const token = await window.grecaptcha.enterprise.execute(
          process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || '',
          { action }
        );
        resolve(token);
      } catch (error) {
        console.error('reCAPTCHA execution failed:', error);
        reject(error);
      }
    });
  });
}

/* ============================================================
    Server-side Recaptcha Validation
   ============================================================ */
async function verifyAction(action: string): Promise<boolean> {
  try {
    console.log(`Verifying reCAPTCHA action: ${action}`);
    const token = await verifyRecaptcha(action);

    const res = await fetch('/api/verify-recaptcha', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, action }),
    });

    if (!res.ok) {
      console.error('reCAPTCHA verification failed with status:', res.status);
      return false;
    }

    const data = await res.json();
    console.log('reCAPTCHA verification response:', data);
    return data.success === true;
  } catch (error) {
    console.error('Error verifying reCAPTCHA:', error);
    return false;
  }
}

/* ============================================================
    Types
   ============================================================ */
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

  /* ============================================================
      PDF / DOCX Parsing Helpers
     ============================================================ */
  const extractTextFromPDF = async (file: File): Promise<string> => {
    const arrayBuffer = await file.arrayBuffer();
    const typedArray = new Uint8Array(arrayBuffer);
    const pdf = await pdfjsLib.getDocument({ data: typedArray }).promise;
    let fullText = '';

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const pageText = content.items.map((item: any) => ('str' in item ? item.str : '')).join(' ');
      fullText += pageText + '\n';
    }

    return fullText;
  };

  const extractTextFromDocx = async (file: File): Promise<string> => {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value;
  };

  /* ============================================================
      File Upload Handler
     ============================================================ */
  const handleFileSelect = async (file: File) => {
    setLoading(true);
    setError(null);
    setFileName(file.name);

    try {
      // 1. Verify User is Human
      const isHuman = await verifyAction('resume_upload');
      if (!isHuman) {
        throw new Error('Security check failed. Please refresh and try again.');
      }

      // 2. Process File
      let text = '';
      if (file.type === 'application/pdf') {
        text = await extractTextFromPDF(file);
      } else if (file.name.endsWith('.docx')) {
        text = await extractTextFromDocx(file);
      } else {
        throw new Error('Unsupported file format');
      }

      setResumeText(text);

      // 3. Run Static Analysis
      const result = analyzeResume(text);
      setAnalysis(result);
      setAIFeedback(null);
    } catch (err: any) {
      console.error('Error in handleFileSelect:', err);
      setError(err.message || 'Failed to analyze resume.');
    } finally {
      setLoading(false);
    }
  };

  /* ============================================================
      Analyze Button for Pasted Text
     ============================================================ */
  const handleAnalyzeText = async () => {
    if (!resumeText.trim()) {
      setError('Please paste resume text before analyzing.');
      return;
    }

    setLoading(true);
    setError(null);
    setFileName(null);
    setAIFeedback(null);

    try {
      const isHuman = await verifyAction('resume_analyze');
      if (!isHuman) {
        throw new Error('Security check failed. Please refresh and try again.');
      }

      const result = analyzeResume(resumeText);
      setAnalysis(result);
    } catch (err: any) {
      setError(err.message || 'Failed to analyze resume.');
    } finally {
      setLoading(false);
    }
  };

  /* ============================================================
      AI Review Handler
     ============================================================ */
  const handleAIReview = async () => {
    const rateLimit = canMakeRequest();
    if (!rateLimit.allowed) {
      setError(rateLimit.reason || 'Rate limit exceeded.');
      return;
    }

    if (!resumeText.trim()) {
      setError('Upload a resume or paste text first.');
      return;
    }

    setAILoading(true);
    setError(null);

    try {
      // 1. Verify User is Human
      const isHuman = await verifyAction('ai_review');
      if (!isHuman) {
        throw new Error('Security check failed.');
      }

      // 2. Call AI API
      const response = await fetch('/api/analyze-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeText }),
      });

      if (!response.ok) throw new Error('AI analysis failed.');

      const data = await response.json();

      // Normalize backend → frontend shape
      setAIFeedback({
        summary: data.summaryCritique,
        bulletSuggestions: data.bulletSuggestions,
        improvedSummary: data.rewrittenSummary,
      });

      recordRequest();
    } catch (err: any) {
      setError(err.message || 'AI Review failed.');
    } finally {
      setAILoading(false);
    }
  };

  const remainingRequests = getRemainingRequests();
  const timeUntilNext = getTimeUntilNextRequest();

  /* ============================================================
      UI Rendering
     ============================================================ */
  return (
    <Box sx={{ minHeight: '100vh', py: 4 }}>
      {/* Load reCAPTCHA Enterprise Script */}
      <Script
        src={`https://www.google.com/recaptcha/enterprise.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`}
        strategy="afterInteractive"
        onLoad={() => console.log('reCAPTCHA loaded')}
      />

      <Container maxWidth="xl">
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" fontWeight={700}>
            Resume Analyzer
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Get instant feedback on your resume with AI-powered insights
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        <Grid container spacing={3}>
          {/* LEFT COLUMN */}
          <Grid xs={12} lg={5}>
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
                    placeholder="Copy and paste your resume content here..."
                    variant="outlined"
                    sx={{ mb: 2 }}
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={handleAnalyzeText}
                    disabled={loading}
                    startIcon={loading ? <CircularProgress size={20} /> : <AnalyticsIcon />}
                  >
                    {loading ? 'Analyzing…' : 'Analyze Text'}
                  </Button>
                </>
              )}
            </Paper>

            {/* AI REVIEW CARD */}
            {analysis && (
              <Paper sx={{ p: 3 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="h6" fontWeight={600}>
                    AI-Powered Review
                  </Typography>
                  <Box textAlign="right">
                    <Typography variant="caption" color="text.secondary" display="block">
                      Requests remaining today: {remainingRequests}
                    </Typography>
                    {timeUntilNext > 0 && (
                      <Typography variant="caption" color="text.secondary">
                        Next in {Math.ceil(timeUntilNext)}s
                      </Typography>
                    )}
                  </Box>
                </Box>

                <Button
                  variant="contained"
                  color="secondary"
                  fullWidth
                  disabled={aiLoading || remainingRequests <= 0 || timeUntilNext > 0}
                  onClick={handleAIReview}
                  startIcon={aiLoading ? <CircularProgress size={20} /> : <AIIcon />}
                >
                  {aiLoading ? 'Analyzing…' : 'Run AI Review'}
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
                    </Alert>
                  </Box>
                )}
              </Paper>
            )}
          </Grid>

          {/* RIGHT COLUMN */}
          <Grid xs={12} lg={7}>
            {loading && (
              <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                <CircularProgress />
              </Box>
            )}

            {!loading && analysis && (
              <Grid container spacing={3}>
                <Grid xs={12} lg={7}>
                  <AnalysisResults analysis={analysis} />
                </Grid>
                <Grid xs={12} lg={5}>
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
