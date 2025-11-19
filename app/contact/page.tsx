import React from 'react';
import { Container, Typography, Box, Link as MuiLink } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import GitHubIcon from '@mui/icons-material/GitHub';
import LanguageIcon from '@mui/icons-material/Language';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact - Career Quill',
  description: 'Get in touch with The Career Quill team. Reach out with questions, feedback, or bug reports.',
};

export default function ContactPage() {
  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Box component="main">
        <Typography
          variant="h1"
          component="h1"
          gutterBottom
          sx={{
            fontSize: { xs: '2rem', md: '2.5rem' },
            fontWeight: 700,
            mb: 2,
          }}
        >
          Get in Touch
        </Typography>

        <Box component="section" sx={{ mb: 6 }}>
          <Typography variant="body1" paragraph sx={{ fontSize: '1.125rem', lineHeight: 1.7, mb: 3 }}>
            I&apos;d love to hear from you. Whether you have questions about The Career Quill, feedback on how to improve it, bug reports, or just want to share your experience using the tool—feel free to reach out.
          </Typography>
          <Typography variant="body1" paragraph sx={{ fontSize: '1.125rem', lineHeight: 1.7 }}>
            This is a passion project built to help people tell their career stories more clearly, and your input helps make it better for everyone.
          </Typography>
        </Box>

        <Box component="section">
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 3,
              maxWidth: 600,
            }}
          >
            {/* Email */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 2,
                p: 3,
                borderRadius: 2,
                backgroundColor: 'background.default',
                border: '1px solid',
                borderColor: 'divider',
                transition: 'all 0.2s ease',
                '&:hover': {
                  borderColor: 'primary.main',
                  backgroundColor: 'rgba(200, 126, 66, 0.05)',
                },
              }}
            >
              <EmailIcon sx={{ color: 'primary.main', fontSize: 28, mt: 0.5 }} />
              <Box sx={{ flex: 1 }}>
                <Typography variant="h3" component="h2" sx={{ fontSize: '1.25rem', fontWeight: 600, mb: 1 }}>
                  Email
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph sx={{ mb: 1.5 }}>
                  For general inquiries, feedback, or questions about The Career Quill.
                </Typography>
                <MuiLink
                  href="mailto:dev@jpbranski.com"
                  underline="hover"
                  sx={{
                    color: 'primary.main',
                    fontWeight: 500,
                    fontSize: '1rem',
                    '&:focus-visible': {
                      outline: '2px solid',
                      outlineColor: 'primary.main',
                      outlineOffset: '2px',
                      borderRadius: '4px',
                    },
                  }}
                >
                  dev@jpbranski.com
                </MuiLink>
              </Box>
            </Box>

            {/* GitHub Issues */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 2,
                p: 3,
                borderRadius: 2,
                backgroundColor: 'background.default',
                border: '1px solid',
                borderColor: 'divider',
                transition: 'all 0.2s ease',
                '&:hover': {
                  borderColor: 'primary.main',
                  backgroundColor: 'rgba(200, 126, 66, 0.05)',
                },
              }}
            >
              <GitHubIcon sx={{ color: 'primary.main', fontSize: 28, mt: 0.5 }} />
              <Box sx={{ flex: 1 }}>
                <Typography variant="h3" component="h2" sx={{ fontSize: '1.25rem', fontWeight: 600, mb: 1 }}>
                  GitHub Issues
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph sx={{ mb: 1.5 }}>
                  Found a bug or have a feature request? Open an issue on GitHub for the fastest response.
                </Typography>
                <MuiLink
                  href="https://github.com/jpbranski/career-quill/issues"
                  target="_blank"
                  rel="noopener noreferrer"
                  underline="hover"
                  sx={{
                    color: 'primary.main',
                    fontWeight: 500,
                    fontSize: '1rem',
                    '&:focus-visible': {
                      outline: '2px solid',
                      outlineColor: 'primary.main',
                      outlineOffset: '2px',
                      borderRadius: '4px',
                    },
                  }}
                >
                  github.com/jpbranski/career-quill/issues
                </MuiLink>
              </Box>
            </Box>

            {/* Personal Website */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 2,
                p: 3,
                borderRadius: 2,
                backgroundColor: 'background.default',
                border: '1px solid',
                borderColor: 'divider',
                transition: 'all 0.2s ease',
                '&:hover': {
                  borderColor: 'primary.main',
                  backgroundColor: 'rgba(200, 126, 66, 0.05)',
                },
              }}
            >
              <LanguageIcon sx={{ color: 'primary.main', fontSize: 28, mt: 0.5 }} />
              <Box sx={{ flex: 1 }}>
                <Typography variant="h3" component="h2" sx={{ fontSize: '1.25rem', fontWeight: 600, mb: 1 }}>
                  Personal Website
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph sx={{ mb: 1.5 }}>
                  Learn more about my work, other projects, and design philosophy.
                </Typography>
                <MuiLink
                  href="https://jpbranski.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  underline="hover"
                  sx={{
                    color: 'primary.main',
                    fontWeight: 500,
                    fontSize: '1rem',
                    '&:focus-visible': {
                      outline: '2px solid',
                      outlineColor: 'primary.main',
                      outlineOffset: '2px',
                      borderRadius: '4px',
                    },
                  }}
                >
                  jpbranski.com
                </MuiLink>
              </Box>
            </Box>
          </Box>
        </Box>

        <Box
          sx={{
            mt: 6,
            p: 3,
            backgroundColor: 'background.default',
            borderRadius: 2,
            borderLeft: '4px solid',
            borderColor: 'primary.main',
          }}
        >
          <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
            <strong>Response Time:</strong> I typically respond to emails and GitHub issues within 2-3 business days. If your message is time-sensitive or relates to a critical bug, please mention that in your subject line or issue title.
          </Typography>
        </Box>
      </Box>
    </Container>
  );
}
