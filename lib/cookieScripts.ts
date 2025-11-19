'use client';

export const onEnable = {
  analytics: () => {
    console.log('Analytics cookies enabled');

    // Initialize Google Analytics if not already loaded
    if (typeof window !== 'undefined' && !window.gtag) {
      const gtagId = process.env.NEXT_PUBLIC_ANALYTICS;
      if (gtagId) {
        // Load gtag script
        const script = document.createElement('script');
        script.src = `https://www.googletagmanager.com/gtag/js?id=${gtagId}`;
        script.async = true;
        document.head.appendChild(script);

        // Initialize dataLayer
        window.dataLayer = window.dataLayer || [];
        window.gtag = function gtag() {
          window.dataLayer.push(arguments);
        };
        window.gtag('js', new Date());
        window.gtag('config', gtagId);
      }
    }
  },

  preferences: () => {
    console.log('Preference cookies enabled');
    // Add any preference-related initialization here
  },

  marketing: () => {
    console.log('Marketing cookies enabled');

    // Initialize Google AdSense if not already loaded
    if (typeof window !== 'undefined') {
      const adSenseId = process.env.NEXT_PUBLIC_ADSENSE;
      if (adSenseId) {
        const script = document.createElement('script');
        script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adSenseId}`;
        script.async = true;
        script.crossOrigin = 'anonymous';
        document.head.appendChild(script);
      }
    }
  },
};

// Type augmentation for window object
declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}
