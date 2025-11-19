import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
        {/* Decorative background with Career Quill logo */}
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: { xs: '350px', md: '500px' },
            height: { xs: '350px', md: '500px' },
            opacity: 0.08,
            zIndex: 0,
            pointerEvents: 'none',
            filter: 'blur(1px)',
          }}
          aria-hidden="true"
        >
          <Image
            src="/images/logo.webp"
            alt=""
            fill
            style={{ objectFit: 'contain' }}
            priority
          />
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
