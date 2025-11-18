'use client';

import React, { useState } from 'react';
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
import { Analytics as AnalyticsIcon, AutoAwesome as AIIcon } from '@mui/icons-material';
import FileUpload from '@/components/analyzer/FileUpload';
import AnalysisResults from '@/components/analyzer/AnalysisResults';
import SuggestionsSidebar from '@/components/analyzer/SuggestionsSidebar';
import { analyzeResume, AnalysisResult } from '@/lib/analyzer';
import { canMakeRequest, recordRequest, getRemainingRequests, getTimeUntilNextRequest } from '@/lib/rateLimit';
import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';

// Configure PDF.js worker
if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
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

  const extractTextFromPDF = async (file: File): Promise<string> => {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let fullText = '';

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const pageText = content.items.map((item: any) => item.str).join(' ');
      fullText += pageText + '\n';
    }

    return fullText;
  };

  const extractTextFromDocx = async (file: File): Promise<string> => {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value;
  };

  const handleFileSelect = async (file: File) => {
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
      const analysisResult = analyzeResume(text);
      setAnalysis(analysisResult);
    } catch (err) {
      console.error('Error processing file:', err);
      setError('Failed to process file. Please try again or paste your resume text manually.');
    } finally {
      setLoading(false);
    }
  };

  const handleTextAnalyze = () => {
    if (!resumeText.trim()) {
      setError('Please enter or upload your resume text');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const analysisResult = analyzeResume(resumeText);
      setAnalysis(analysisResult);
    } catch (err) {
      console.error('Error analyzing text:', err);
      setError('Failed to analyze resume. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAIReview = async () => {
    const rateLimitCheck = canMakeRequest();

    if (!rateLimitCheck.allowed) {
      setError(rateLimitCheck.reason || 'Rate limit exceeded');
      return;
    }

    if (!resumeText.trim()) {
      setError('Please enter or upload your resume text first');
      return;
    }

    setAILoading(true);
    setError(null);

    try {
      const response = await fetch('/api/analyze-resume', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ resumeText }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to get AI feedback');
      }

      const data = await response.json();
      setAIFeedback(data);
      recordRequest();
    } catch (err: any) {
      console.error('Error getting AI feedback:', err);
      setError(err.message || 'Failed to get AI feedback. Please try again later.');
    } finally {
      setAILoading(false);
    }
  };

  const remainingRequests = getRemainingRequests();
  const timeUntilNext = getTimeUntilNextRequest();

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="xl">
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" gutterBottom fontWeight={700}>
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
          {/* Input Panel */}
          <Grid item xs={12} lg={5}>
            <Paper sx={{ p: 3, mb: 3 }}>
              <Tabs value={tabValue} onChange={(_, v) => setTabValue(v)} sx={{ mb: 3 }}>
                <Tab label="Upload File" />
                <Tab label="Paste Text" />
              </Tabs>

              {tabValue === 0 ? (
                <Box>
                  <FileUpload
                    onFileSelect={handleFileSelect}
                    onTextPaste={setResumeText}
                  />
                  {fileName && (
                    <Alert severity="info" sx={{ mt: 2 }}>
                      Loaded: {fileName}
                    </Alert>
                  )}
                </Box>
              ) : (
                <Box>
                  <TextField
                    fullWidth
                    multiline
                    rows={12}
                    label="Paste your resume text here"
                    value={resumeText}
                    onChange={(e) => setResumeText(e.target.value)}
                    placeholder="Paste the text content of your resume here..."
                  />
                  <Button
                    variant="contained"
                    fullWidth
                    sx={{ mt: 2 }}
                    onClick={handleTextAnalyze}
                    disabled={loading || !resumeText.trim()}
                    startIcon={loading ? <CircularProgress size={20} /> : <AnalyticsIcon />}
                  >
                    {loading ? 'Analyzing...' : 'Analyze Resume'}
                  </Button>
                </Box>
              )}
            </Paper>

            {/* AI Review Section */}
            {analysis && (
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  AI-Powered Review
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Get detailed AI feedback on your resume content and structure.
                </Typography>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="caption" color="text.secondary">
                    {remainingRequests} requests remaining today
                  </Typography>
                  {timeUntilNext > 0 && (
                    <Typography variant="caption" color="text.secondary">
                      Next available in {timeUntilNext}s
                    </Typography>
                  )}
                </Box>

                <Button
                  variant="contained"
                  fullWidth
                  onClick={handleAIReview}
                  disabled={aiLoading || timeUntilNext > 0}
                  startIcon={aiLoading ? <CircularProgress size={20} /> : <AIIcon />}
                  sx={{
                    background: 'linear-gradient(135deg, #5A64B3 0%, #8B92D9 100%)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #3F4682 0%, #5A64B3 100%)',
                    },
                  }}
                >
                  {aiLoading ? 'Analyzing with AI...' : 'Run AI Review'}
                </Button>

                {aiFeedback && (
                  <Box sx={{ mt: 3 }}>
                    <Alert severity="info" icon={<AIIcon />}>
                      <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                        AI Feedback
                      </Typography>
                      <Typography variant="body2" paragraph>
                        {aiFeedback.summary}
                      </Typography>

                      {aiFeedback.bulletSuggestions.length > 0 && (
                        <>
                          <Typography variant="body2" fontWeight={600} gutterBottom>
                            Bullet Point Suggestions:
                          </Typography>
                          <Box component="ul" sx={{ pl: 2, mt: 1 }}>
                            {aiFeedback.bulletSuggestions.map((suggestion, idx) => (
                              <Typography component="li" key={idx} variant="body2">
                                {suggestion}
                              </Typography>
                            ))}
                          </Box>
                        </>
                      )}

                      {aiFeedback.improvedSummary && (
                        <>
                          <Divider sx={{ my: 1.5 }} />
                          <Typography variant="body2" fontWeight={600} gutterBottom>
                            Improved Summary:
                          </Typography>
                          <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
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

          {/* Results Panel */}
          <Grid item xs={12} lg={7}>
            {!analysis && !loading && (
              <Paper sx={{ p: 8, textAlign: 'center' }}>
                <AnalyticsIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" color="text.secondary">
                  Upload or paste your resume to get started
                </Typography>
              </Paper>
            )}

            {loading && (
              <Paper sx={{ p: 8, textAlign: 'center' }}>
                <CircularProgress size={60} />
                <Typography variant="h6" color="text.secondary" sx={{ mt: 2 }}>
                  Analyzing your resume...
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
