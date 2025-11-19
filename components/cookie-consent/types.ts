export interface CookieConsent {
  necessary: boolean;
  analytics: boolean;
  preferences: boolean;
  marketing: boolean;
  timestamp: number;
}

export interface CookieCategory {
  id: keyof Omit<CookieConsent, 'timestamp'>;
  label: string;
  description: string;
  required: boolean;
}

export const COOKIE_CATEGORIES: CookieCategory[] = [
  {
    id: 'necessary',
    label: 'Necessary',
    description: 'Essential cookies required for the website to function properly. These cannot be disabled.',
    required: true,
  },
  {
    id: 'analytics',
    label: 'Analytics',
    description: 'Help us understand how visitors interact with our website by collecting and reporting information anonymously.',
    required: false,
  },
  {
    id: 'preferences',
    label: 'Preferences',
    description: 'Enable the website to remember your preferences and provide enhanced, personalized features.',
    required: false,
  },
  {
    id: 'marketing',
    label: 'Marketing',
    description: 'Used to track visitors across websites to display relevant advertisements.',
    required: false,
  },
];

export const DEFAULT_CONSENT: CookieConsent = {
  necessary: true,
  analytics: false,
  preferences: false,
  marketing: false,
  timestamp: Date.now(),
};
