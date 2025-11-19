import React from 'react';
import Link from 'next/link';
import { Container, Typography, Box, Button } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';

export default function NotFound() {
  return (
    <Container maxWidth="md">
      <Box
        component="main"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 'calc(100vh - 200px)',
          textAlign: 'center',
          py: 8,
          position: 'relative',
        }}
      >
        {/* Decorative background element with quill theme */}
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: { xs: '300px', md: '400px' },
            height: { xs: '300px', md: '400px' },
            opacity: 0.05,
            zIndex: 0,
            pointerEvents: 'none',
          }}
          aria-hidden="true"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ width: '100%', height: '100%' }}
          >
            {/* Stylized quill feather */}
            <path
              d="M20.24 3.17C19.13 2.46 17.89 2 16.5 2c-1.84 0-3.5.71-4.76 1.86C10.48 2.71 8.82 2 6.98 2c-1.39 0-2.63.46-3.74 1.17-.38.24-.49.74-.25 1.12.24.38.74.49 1.12.25C5.01 3.92 5.97 3.5 6.98 3.5c1.53 0 2.91.59 3.95 1.55L8.5 7.5 7 9l-2 2c-.39.39-.39 1.02 0 1.41.2.2.45.29.71.29.26 0 .51-.1.71-.29l2-2 1.5-1.5 2.43-2.45c1.04-.96 2.42-1.55 3.95-1.55 1.01 0 1.97.42 2.87 1.04.38.24.88.13 1.12-.25.24-.38.13-.88-.25-1.12z"
              fill="currentColor"
            />
            <path
              d="M7 9l-2 2v9c0 .55.45 1 1 1h2c.55 0 1-.45 1-1v-9L7 9z"
              fill="currentColor"
              opacity="0.8"
            />
            <path
              d="M8.5 7.5L10.93 5.05c.5.52.92 1.12 1.24 1.77L8.5 10.5 7 9l1.5-1.5z"
              fill="currentColor"
              opacity="0.6"
            />
          </svg>
        </Box>

        {/* Content */}
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Typography
            variant="h1"
            component="h1"
            sx={{
              fontSize: { xs: '4rem', md: '6rem' },
              fontWeight: 700,
              background: 'linear-gradient(135deg, #C87E42 0%, #E4B784 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              mb: 2,
            }}
          >
            404
          </Typography>

          <Typography
            variant="h2"
            component="h2"
            gutterBottom
            sx={{
              fontSize: { xs: '1.5rem', md: '2rem' },
              fontWeight: 600,
              color: 'text.primary',
              mb: 2,
            }}
          >
            Page Not Found
          </Typography>

          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ mb: 4, maxWidth: '500px', mx: 'auto' }}
          >
            Looks like this page hasn&apos;t been written yet. The story you&apos;re looking for might have been moved, deleted, or perhaps it never existed.
          </Typography>

          {/* Horizontal divider with decorative element */}
          <Box
            sx={{
              width: '100%',
              maxWidth: '400px',
              height: '1px',
              background: 'linear-gradient(90deg, transparent, #C87E42, transparent)',
              my: 4,
              mx: 'auto',
            }}
            aria-hidden="true"
          />

          <Button
            component={Link}
            href="/"
            variant="contained"
            size="large"
            startIcon={<HomeIcon />}
            sx={{
              px: 4,
              py: 1.5,
              fontSize: '1rem',
              fontWeight: 600,
              textTransform: 'none',
              backgroundColor: 'primary.main',
              color: '#FFFFFF',
              borderRadius: 2,
              boxShadow: '0 4px 14px rgba(200, 126, 66, 0.3)',
              transition: 'all 0.3s ease',
              '&:hover': {
                backgroundColor: 'primary.dark',
                boxShadow: '0 6px 20px rgba(200, 126, 66, 0.4)',
                transform: 'translateY(-2px)',
              },
              '&:focus-visible': {
                outline: '3px solid',
                outlineColor: 'primary.light',
                outlineOffset: '2px',
              },
            }}
          >
            Return to Home
          </Button>

          <Box sx={{ mt: 4 }}>
            <Typography variant="body2" color="text.secondary">
              Looking for something specific? Try one of these:
            </Typography>
            <Box
              sx={{
                display: 'flex',
                gap: 2,
                justifyContent: 'center',
                mt: 2,
                flexWrap: 'wrap',
              }}
            >
              <Button
                component={Link}
                href="/builder"
                variant="text"
                sx={{
                  color: 'text.secondary',
                  '&:hover': {
                    color: 'primary.main',
                    backgroundColor: 'rgba(200, 126, 66, 0.1)',
                  },
                }}
              >
                Resume Builder
              </Button>
              <Button
                component={Link}
                href="/analyzer"
                variant="text"
                sx={{
                  color: 'text.secondary',
                  '&:hover': {
                    color: 'primary.main',
                    backgroundColor: 'rgba(200, 126, 66, 0.1)',
                  },
                }}
              >
                Resume Analyzer
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </Container>
  );
}
