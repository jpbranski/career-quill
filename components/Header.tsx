'use client';

import React from 'react';
import Link from 'next/link';
import { AppBar, Toolbar, Box, Button, Container } from '@mui/material';
import Logo from './Logo';
import ThemeToggle from './ThemeToggle';

interface HeaderProps {
  mode: 'light' | 'dark';
  onThemeToggle: () => void;
}

export default function Header({ mode, onThemeToggle }: HeaderProps) {
  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        backgroundColor: 'background.paper',
        borderBottom: '1px solid',
        borderColor: 'divider',
        backdropFilter: 'blur(10px)',
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ minHeight: 64 }}>
          {/* Logo and Brand */}
          <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                cursor: 'pointer',
                transition: 'opacity 0.2s ease',
                '&:hover': {
                  opacity: 0.8,
                },
              }}
            >
              <Logo size={32} />
              <Box
                component="span"
                sx={{
                  fontSize: '1.5rem',
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, #C87E42 0%, #E4B784 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Career Quill
              </Box>
            </Box>
          </Link>

          {/* Spacer */}
          <Box sx={{ flexGrow: 1 }} />

          {/* Navigation */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Button
              component={Link}
              href="/builder"
              sx={{
                color: 'text.primary',
                fontWeight: 500,
                '&:hover': {
                  backgroundColor: 'rgba(200, 126, 66, 0.1)',
                },
              }}
            >
              Resume Builder
            </Button>
            <Button
              component={Link}
              href="/analyzer"
              sx={{
                color: 'text.primary',
                fontWeight: 500,
                '&:hover': {
                  backgroundColor: 'rgba(200, 126, 66, 0.1)',
                },
              }}
            >
              Resume Analyzer
            </Button>
            <ThemeToggle mode={mode} onToggle={onThemeToggle} />
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
