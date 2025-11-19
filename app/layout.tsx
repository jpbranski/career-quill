'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box } from '@mui/material';
import { createCareerQuillTheme } from '@/theme/theme';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CookieBanner from '@/components/cookie-consent/CookieBanner';
import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mode, setMode] = useState<'light' | 'dark'>('dark');
  const [mounted, setMounted] = useState(false);
  const [consent, setConsent] = useState<any>(null);

  // Load theme preference and cookie consent from localStorage
  useEffect(() => {
    const savedMode = localStorage.getItem('theme-mode') as 'light' | 'dark' | null;
    if (savedMode) {
      setMode(savedMode);
    }

    // Load cookie consent
    try {
      const storedConsent = localStorage.getItem('cookie-consent');
      if (storedConsent) {
        setConsent(JSON.parse(storedConsent));
      }
    } catch (error) {
      console.error('Error loading cookie consent:', error);
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

        {/* reCAPTCHA Enterprise Script - Always loaded (necessary for form functionality) */}
        <script
          src={`https://www.google.com/recaptcha/enterprise.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ''}`}
          async
          defer
        />

        {/* Conditional Analytics Script - Only load if analytics consent is given */}
        {consent?.analytics && process.env.NEXT_PUBLIC_ANALYTICS && (
          <>
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_ANALYTICS}`}
            />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${process.env.NEXT_PUBLIC_ANALYTICS}');
                `,
              }}
            />
          </>
        )}

        {/* Conditional AdSense Script - Only load if marketing consent is given */}
        {consent?.marketing && process.env.NEXT_PUBLIC_ADSENSE && (
          <script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE}`}
            crossOrigin="anonymous"
          />
        )}
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

          {/* Cookie Consent Banner */}
          <CookieBanner />
        </ThemeProvider>
      </body>
    </html>
  );
}
