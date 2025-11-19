'use client';

import React, { useState, useEffect, useMemo, ReactNode } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box } from '@mui/material';
import Script from 'next/script';
import { createCareerQuillTheme } from '@/theme/theme';
import { ThemeContextProvider, useThemeMode } from './ThemeContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CookieBanner from '@/components/cookie-consent/CookieBanner';

interface CookieConsent {
  necessary: boolean;
  analytics: boolean;
  preferences: boolean;
  marketing: boolean;
  timestamp?: number;
}

interface AppProviderProps {
  children: ReactNode;
}

function AppContent({ children }: AppProviderProps) {
  const { mode } = useThemeMode();
  const [consent, setConsent] = useState<CookieConsent | null>(null);
  const [mounted, setMounted] = useState(false);

  // Create theme based on current mode
  const theme = useMemo(() => createCareerQuillTheme(mode), [mode]);

  // Load cookie consent from localStorage
  useEffect(() => {
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

  // Environment variables
  const analyticsId = process.env.NEXT_PUBLIC_ANALYTICS;
  const adsenseId = process.env.NEXT_PUBLIC_ADSENSE;

  // Determine if scripts should load
  const shouldLoadAnalytics = mounted && consent?.analytics && analyticsId;
  const shouldLoadAdsense = mounted && consent?.marketing && adsenseId;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      {/* Google Analytics - only load with consent */}
      {shouldLoadAnalytics && (
        <>
          <Script
            strategy="afterInteractive"
            src={`https://www.googletagmanager.com/gtag/js?id=${analyticsId}`}
          />
          <Script
            id="google-analytics"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${analyticsId}');
              `,
            }}
          />
        </>
      )}

      {/* Google AdSense - only load with consent */}
      {shouldLoadAdsense && (
        <Script
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseId}`}
          crossOrigin="anonymous"
          strategy="lazyOnload"
        />
      )}

      {/* Main App Layout - Use visibility to prevent flash instead of returning null */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          visibility: mounted ? 'visible' : 'hidden',
          opacity: mounted ? 1 : 0,
          transition: 'opacity 0.2s ease-in',
        }}
      >
        <Header />
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
  );
}

export default function AppProvider({ children }: AppProviderProps) {
  return (
    <ThemeContextProvider>
      <AppContent>{children}</AppContent>
    </ThemeContextProvider>
  );
}
