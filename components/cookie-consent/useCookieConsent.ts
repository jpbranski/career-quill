'use client';

import { useState, useEffect, useCallback } from 'react';
import { CookieConsent, DEFAULT_CONSENT } from './types';
import { onEnable } from '@/lib/cookieScripts';

const STORAGE_KEY = 'cookie-consent';

export function useCookieConsent() {
  const [consent, setConsent] = useState<CookieConsent | null>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Load consent from localStorage
  useEffect(() => {
    setMounted(true);
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as CookieConsent;
        setConsent(parsed);
        setShowBanner(false);
      } else {
        setShowBanner(true);
      }
    } catch (error) {
      console.error('Error loading cookie consent:', error);
      setShowBanner(true);
    }
  }, []);

  // Save consent to localStorage and trigger hooks
  const saveConsent = useCallback((newConsent: CookieConsent) => {
    const consentWithTimestamp = {
      ...newConsent,
      timestamp: Date.now(),
    };

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(consentWithTimestamp));
      setConsent(consentWithTimestamp);
      setShowBanner(false);

      // Trigger category hooks
      if (newConsent.analytics) {
        onEnable.analytics();
      }
      if (newConsent.preferences) {
        onEnable.preferences();
      }
      if (newConsent.marketing) {
        onEnable.marketing();
      }

      // Reload page to apply script changes
      if (typeof window !== 'undefined') {
        window.location.reload();
      }
    } catch (error) {
      console.error('Error saving cookie consent:', error);
    }
  }, []);

  const acceptAll = useCallback(() => {
    saveConsent({
      necessary: true,
      analytics: true,
      preferences: true,
      marketing: true,
      timestamp: Date.now(),
    });
  }, [saveConsent]);

  const rejectAll = useCallback(() => {
    saveConsent({
      necessary: true,
      analytics: false,
      preferences: false,
      marketing: false,
      timestamp: Date.now(),
    });
  }, [saveConsent]);

  const updateConsent = useCallback(
    (updates: Partial<CookieConsent>) => {
      const currentConsent = consent || DEFAULT_CONSENT;
      saveConsent({
        ...currentConsent,
        ...updates,
        necessary: true, // Always keep necessary enabled
        timestamp: Date.now(),
      });
    },
    [consent, saveConsent]
  );

  return {
    consent: consent || DEFAULT_CONSENT,
    showBanner: mounted && showBanner,
    acceptAll,
    rejectAll,
    updateConsent,
    saveConsent,
  };
}
