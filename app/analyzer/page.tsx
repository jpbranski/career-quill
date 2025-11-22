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
  Grid,
  Alert,
  CircularProgress,
  Tabs,
  Tab,
  Divider,
} from '@mui/material';
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

// PDF worker setup
if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.js';
}

// Declare global types for reCAPTCHA Enterprise
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

  /* ============================================================
      HELPER: Invisible Verification
     ============================================================ */
  const verifyAction = async (actionName: string): Promise<boolean> => {
    try {
      if (!window.grecaptcha || !window.grecaptcha.enterprise) {
        console.warn('reCAPTCHA not ready yet');
        return false;
      }

      // 1. Get the token from Google
      const token = await window.grecaptcha.enterprise.execute(
        process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!,
        { action: actionName }
      );

      // 2. Verify token on your backend
      const res = await fetch('/api/verify-captcha', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, action: actionName }),
      });

      const data = await res.json();

      if (!data.ok) {
        console.error('Captcha Failed:', data.reasons);
        return false;
      }

      return true; // Score was >= 0.5
    } catch (err) {
      console.error('Verification error:', err);
      return false;
    }
  };

  /* ============================================================
      PDF + DOCX Extractors
     ============================================================ */
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
      const result = await analyzeResume(text);
      setAnalysis(result);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to process file.');
    } finally {
      setLoading(false);
    }
  };

  /* ============================================================
      Paste Text Handler
     ============================================================ */
  const handleTextAnalyze = async () => {
    if (!resumeText.trim()) {
      setError('Please enter or paste resume text.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // 1. Verify User is Human
      const isHuman = await verifyAction('text_analyze');
      if (!isHuman) {
        throw new Error('Security check failed.');
      }

      // 2. Analyze
      const result = await analyzeResume(resumeText);
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
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 4 }}>

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
                    {loading ? 'Analyzing…' : 'Analyze Resume'}
                  </Button>
                </>
              )}
            </Paper>

            {/* AI REVIEW */}
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
          <Grid item xs={12} lg={7}>
            {!analysis && !loading && (
              <Paper sx={{ p: 8, textAlign: 'center' }}>
                <AnalyticsIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" color="text.secondary">
                  Upload or paste to begin
                </Typography>
              </Paper>
            )}
            {/* ... (Rest of UI components) */}
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