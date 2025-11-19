import React from 'react';
import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import AppProvider from '@/providers/AppProvider';
import './globals.css';

// Metadata for SEO
export const metadata: Metadata = {
  title: 'Career Quill - Resume Builder & Analyzer',
  description: 'Build and refine a resume you\'re proud of with Career Quill - a professional resume builder and analyzer',
  metadataBase: new URL('https://careerquill.app'),
  keywords: ['resume builder', 'resume analyzer', 'career', 'job application', 'CV builder'],
  authors: [{ name: 'Career Quill' }],
  creator: 'Career Quill',
  publisher: 'Career Quill',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://careerquill.app',
    title: 'Career Quill - Resume Builder & Analyzer',
    description: 'Build and refine a resume you\'re proud of with Career Quill - a professional resume builder and analyzer',
    siteName: 'Career Quill',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Career Quill - Resume Builder & Analyzer',
    description: 'Build and refine a resume you\'re proud of with Career Quill - a professional resume builder and analyzer',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#C87E42',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const recaptchaSiteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* reCAPTCHA Enterprise Script - Always loaded (necessary for form functionality) */}
        {recaptchaSiteKey && (
          <Script
            src={`https://www.google.com/recaptcha/enterprise.js?render=${recaptchaSiteKey}`}
            strategy="lazyOnload"
          />
        )}
      </head>
      <body>
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
