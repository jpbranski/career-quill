'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box } from '@mui/material';
import { createCareerQuillTheme } from '@/theme/theme';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mode, setMode] = useState<'light' | 'dark'>('dark');
  const [mounted, setMounted] = useState(false);

  // Load theme preference from localStorage
  useEffect(() => {
    const savedMode = localStorage.getItem('theme-mode') as 'light' | 'dark' | null;
    if (savedMode) {
      setMode(savedMode);
    }
    setMounted(true);
  }, []);

  // Update localStorage and document attribute when theme changes
  useEffect(() => {
    if (mounted) {
      localStorage.setItem('theme-mode', mode);
      document.documentElement.setAttribute('data-theme', mode);
    }
  }, [mode, mounted]);

  const theme = useMemo(() => createCareerQuillTheme(mode), [mode]);

  const handleThemeToggle = () => {
    setMode((prevMode) => (prevMode === 'dark' ? 'light' : 'dark'));
  };

  // Prevent flash of wrong theme
  if (!mounted) {
    return null;
  }

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Build and refine a resume you're proud of with Career Quill - a professional resume builder and analyzer" />
        <meta name="theme-color" content="#C87E42" />
        <title>Career Quill - Resume Builder & Analyzer</title>
        {/* reCAPTCHA v3 Script */}
        <script
          src={`https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ''}`}
          async
          defer
        />
      </head>
      <body>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              minHeight: '100vh',
            }}
          >
            <Header mode={mode} onThemeToggle={handleThemeToggle} />
            <Box
              component="main"
              sx={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {children}
            </Box>
            <Footer />
          </Box>
        </ThemeProvider>
      </body>
    </html>
  );
}
