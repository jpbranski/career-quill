'use client';

import React from 'react';
import Link from 'next/link';
import { Box, Container, Typography, Link as MuiLink } from '@mui/material';
import Logo from './Logo';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        mt: 'auto',
        py: 4,
        borderTop: '1px solid',
        borderColor: 'divider',
        backgroundColor: 'background.paper',
      }}
    >
      <Container maxWidth="xl">
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'center', md: 'flex-start' },
            gap: 3,
          }}
        >
          {/* Brand Section */}
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: { xs: 'center', md: 'flex-start' } }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
              <Logo size={28} />
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, #C87E42 0%, #E4B784 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Career Quill
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary">
              Build and refine a resume you&apos;re proud of
            </Typography>
          </Box>

          {/* Links Section */}
          <Box
            sx={{
              display: 'flex',
              gap: 4,
              flexDirection: { xs: 'column', sm: 'row' },
              textAlign: { xs: 'center', md: 'left' },
            }}
          >
            <Box>
              <Typography variant="subtitle2" fontWeight={600} mb={1}>
                Tools
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                <MuiLink component={Link} href="/builder" underline="hover" color="text.secondary">
                  Resume Builder
                </MuiLink>
                <MuiLink component={Link} href="/analyzer" underline="hover" color="text.secondary">
                  Resume Analyzer
                </MuiLink>
              </Box>
            </Box>

            <Box>
              <Typography variant="subtitle2" fontWeight={600} mb={1}>
                About
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                <MuiLink component={Link} href="/about" underline="hover" color="text.secondary">
                  About
                </MuiLink>
                <MuiLink component={Link} href="/contact" underline="hover" color="text.secondary">
                  Contact
                </MuiLink>
              </Box>
            </Box>

            <Box>
              <Typography variant="subtitle2" fontWeight={600} mb={1}>
                Legal
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                <MuiLink component={Link} href="/privacy" underline="hover" color="text.secondary">
                  Privacy Policy
                </MuiLink>
                <MuiLink component={Link} href="/terms" underline="hover" color="text.secondary">
                  Terms of Service
                </MuiLink>
                <MuiLink component={Link} href="/accessibility" underline="hover" color="text.secondary">
                  Accessibility
                </MuiLink>
              </Box>
            </Box>

            <Box>
              <Typography variant="subtitle2" fontWeight={600} mb={1}>
                Privacy
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 200 }}>
                All data is stored locally on your device. Nothing is sent to our servers except AI analysis requests.
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Copyright */}
        <Box
          sx={{
            mt: 3,
            pt: 3,
            borderTop: '1px solid',
            borderColor: 'divider',
            textAlign: 'center',
          }}
        >
          <Typography variant="body2" color="text.secondary">
            © {currentYear} Career Quill. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
