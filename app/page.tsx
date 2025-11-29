'use client';

import React from 'react';
import Link from 'next/link';
import { Box, Container, Typography, Button, Card, CardContent, Grid, Stack } from '@mui/material';
import {
  Edit as EditIcon,
  Assessment as AssessmentIcon,
  Download as DownloadIcon,
  Lock as LockIcon,
  Speed as SpeedIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';
import Logo from '@/components/Logo';

export default function HomePage() {
  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, rgba(200, 126, 66, 0.1) 0%, rgba(90, 100, 179, 0.1) 100%)',
          py: { xs: 8, md: 12 },
        }}
      >
        <Container maxWidth="lg">
          <Stack spacing={4} alignItems="center" textAlign="center">
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Logo size={120} />
            </Box>

            <Typography
              variant="h1"
              sx={{
                maxWidth: 800,
                background: 'linear-gradient(135deg, #C87E42 0%, #E4B784 50%, #5A64B3 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Build and refine a resume you&apos;re proud of
            </Typography>

            <Typography
              variant="h5"
              color="text.secondary"
              sx={{ maxWidth: 700, lineHeight: 1.6 }}
            >
              Career Quill helps you create professional resumes with beautiful templates
              and get AI-powered feedback to make them stand out.
            </Typography>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 2 }}>
              <Button
                component={Link}
                href="/builder"
                variant="contained"
                size="large"
                startIcon={<EditIcon />}
                sx={{
                  px: 4,
                  py: 1.5,
                  fontSize: '1.1rem',
                  background: 'linear-gradient(135deg, #C87E42 0%, #E4B784 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #A66835 0%, #C87E42 100%)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 24px rgba(200, 126, 66, 0.3)',
                  },
                }}
              >
                Start Building
              </Button>

              <Button
                component={Link}
                href="/analyzer"
                variant="outlined"
                size="large"
                startIcon={<AssessmentIcon />}
                sx={{
                  px: 4,
                  py: 1.5,
                  fontSize: '1.1rem',
                  borderColor: 'primary.main',
                  color: 'primary.main',
                  '&:hover': {
                    borderColor: 'primary.light',
                    backgroundColor: 'rgba(200, 126, 66, 0.1)',
                    transform: 'translateY(-2px)',
                  },
                }}
              >
                Analyze Resume
              </Button>
            </Stack>
          </Stack>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 } }}>
        <Typography variant="h2" textAlign="center" mb={6}>
          Everything you need
        </Typography>

        <Grid container spacing={4}>
          {/* Resume Builder Card */}
          <Grid item xs={12} md={6}>
            <Card
              sx={{
                height: '100%',
                borderRadius: 3,
                border: '1px solid',
                borderColor: 'divider',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: '0 12px 32px rgba(200, 126, 66, 0.2)',
                  borderColor: 'primary.main',
                },
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Box
                  sx={{
                    width: 56,
                    height: 56,
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'linear-gradient(135deg, #C87E42 0%, #E4B784 100%)',
                    mb: 3,
                  }}
                >
                  <EditIcon sx={{ fontSize: 32, color: 'white' }} />
                </Box>

                <Typography variant="h4" gutterBottom>
                  Resume Builder
                </Typography>

                <Typography variant="body1" color="text.secondary" paragraph>
                  Create a professional resume with our intuitive editor. Choose from 6 beautiful
                  templates, customize every section, and export to PDF, DOCX, or TXT.
                </Typography>

                <Stack spacing={1} sx={{ mt: 3 }}>
                  <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box component="span" sx={{ color: 'primary.main' }}>✓</Box>
                    6 professional templates
                  </Typography>
                  <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box component="span" sx={{ color: 'primary.main' }}>✓</Box>
                    Real-time preview
                  </Typography>
                  <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box component="span" sx={{ color: 'primary.main' }}>✓</Box>
                    Drag-and-drop sections
                  </Typography>
                  <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box component="span" sx={{ color: 'primary.main' }}>✓</Box>
                    Multiple export formats
                  </Typography>
                </Stack>

                <Button
                  component={Link}
                  href="/builder"
                  variant="text"
                  sx={{ mt: 3, fontWeight: 600 }}
                >
                  Start building →
                </Button>
              </CardContent>
            </Card>
          </Grid>

          {/* Resume Analyzer Card */}
          <Grid item xs={12} md={6}>
            <Card
              sx={{
                height: '100%',
                borderRadius: 3,
                border: '1px solid',
                borderColor: 'divider',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: '0 12px 32px rgba(90, 100, 179, 0.2)',
                  borderColor: 'secondary.main',
                },
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Box
                  sx={{
                    width: 56,
                    height: 56,
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'linear-gradient(135deg, #5A64B3 0%, #8B92D9 100%)',
                    mb: 3,
                  }}
                >
                  <AssessmentIcon sx={{ fontSize: 32, color: 'white' }} />
                </Box>

                <Typography variant="h4" gutterBottom>
                  Resume Analyzer
                </Typography>

                <Typography variant="body1" color="text.secondary" paragraph>
                  Get instant feedback on your resume. Upload a PDF or DOCX, and receive
                  actionable suggestions plus optional AI-powered critique.
                </Typography>

                <Stack spacing={1} sx={{ mt: 3 }}>
                  <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box component="span" sx={{ color: 'secondary.main' }}>✓</Box>
                    Instant analysis
                  </Typography>
                  <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box component="span" sx={{ color: 'secondary.main' }}>✓</Box>
                    Keyword optimization
                  </Typography>
                  <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box component="span" sx={{ color: 'secondary.main' }}>✓</Box>
                    Action verb suggestions
                  </Typography>
                  <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box component="span" sx={{ color: 'secondary.main' }}>✓</Box>
                    AI-powered review
                  </Typography>
                </Stack>

                <Button
                  component={Link}
                  href="/analyzer"
                  variant="text"
                  sx={{ mt: 3, fontWeight: 600 }}
                >
                  Analyze now →
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/* How It Works Section */}
      <Box sx={{ backgroundColor: 'background.paper', py: { xs: 8, md: 12 } }}>
        <Container maxWidth="lg">
          <Typography variant="h2" textAlign="center" mb={8}>
            How it works
          </Typography>

          <Grid container spacing={6}>
            <Grid item xs={12} md={4}>
              <Stack alignItems="center" textAlign="center" spacing={2}>
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'linear-gradient(135deg, #C87E42 0%, #E4B784 100%)',
                    fontSize: '2rem',
                    fontWeight: 700,
                    color: 'white',
                  }}
                >
                  1
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                  <EditIcon sx={{ fontSize: 48, color: 'primary.main' }} />
                </Box>
                <Typography variant="h5" fontWeight={600}>
                  Build or Upload
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Create a new resume from scratch with our builder, or upload your existing
                  resume for analysis.
                </Typography>
              </Stack>
            </Grid>

            <Grid item xs={12} md={4}>
              <Stack alignItems="center" textAlign="center" spacing={2}>
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'linear-gradient(135deg, #C87E42 0%, #E4B784 100%)',
                    fontSize: '2rem',
                    fontWeight: 700,
                    color: 'white',
                  }}
                >
                  2
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                  <TrendingUpIcon sx={{ fontSize: 48, color: 'primary.main' }} />
                </Box>
                <Typography variant="h5" fontWeight={600}>
                  Get Feedback
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Receive instant suggestions on structure, keywords, action verbs, and
                  quantified achievements.
                </Typography>
              </Stack>
            </Grid>

            <Grid item xs={12} md={4}>
              <Stack alignItems="center" textAlign="center" spacing={2}>
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'linear-gradient(135deg, #C87E42 0%, #E4B784 100%)',
                    fontSize: '2rem',
                    fontWeight: 700,
                    color: 'white',
                  }}
                >
                  3
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                  <DownloadIcon sx={{ fontSize: 48, color: 'primary.main' }} />
                </Box>
                <Typography variant="h5" fontWeight={600}>
                  Export & Apply
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Download your polished resume in PDF, DOCX, or TXT format and start
                  applying with confidence.
                </Typography>
              </Stack>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Privacy & Features Section */}
      <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 } }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Stack alignItems="center" textAlign="center" spacing={2}>
              <LockIcon sx={{ fontSize: 56, color: 'primary.main' }} />
              <Typography variant="h6" fontWeight={600}>
                Privacy First
              </Typography>
              <Typography variant="body2" color="text.secondary">
                All data is stored locally on your device. We don&apos;t have access to your resume except for optional AI analysis.
              </Typography>
            </Stack>
          </Grid>

          <Grid item xs={12} md={4}>
            <Stack alignItems="center" textAlign="center" spacing={2}>
              <SpeedIcon sx={{ fontSize: 56, color: 'primary.main' }} />
              <Typography variant="h6" fontWeight={600}>
                Lightning Fast
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Real-time preview and instant analysis. No page refreshes, no waiting around.
              </Typography>
            </Stack>
          </Grid>

          <Grid item xs={12} md={4}>
            <Stack alignItems="center" textAlign="center" spacing={2}>
              <DownloadIcon sx={{ fontSize: 56, color: 'primary.main' }} />
              <Typography variant="h6" fontWeight={600}>
                Multiple Formats
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Export your resume in PDF, DOCX, or plain text format to fit any application requirement.
              </Typography>
            </Stack>
          </Grid>
        </Grid>

        {/* CTA */}
        <Box sx={{ mt: 8, textAlign: 'center' }}>
          <Typography variant="h3" gutterBottom>
            Ready to get started?
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Create your professional resume in minutes.
          </Typography>
          <Button
            component={Link}
            href="/builder"
            variant="contained"
            size="large"
            sx={{
              mt: 2,
              px: 5,
              py: 2,
              fontSize: '1.1rem',
              background: 'linear-gradient(135deg, #C87E42 0%, #E4B784 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #A66835 0%, #C87E42 100%)',
              },
            }}
          >
            Get Started Free
          </Button>
        </Box>
      </Container>
    </Box>
  );
}
