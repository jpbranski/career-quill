'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Modal,
  Box,
  Typography,
  Button,
  Switch,
  FormControlLabel,
  Divider,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useCookieConsent } from './useCookieConsent';
import { COOKIE_CATEGORIES, CookieConsent } from './types';
import styles from './styles.module.css';

interface CookieModalProps {
  open: boolean;
  onClose: () => void;
}

export default function CookieModal({ open, onClose }: CookieModalProps) {
  const { consent, saveConsent, acceptAll, rejectAll } = useCookieConsent();
  const [localConsent, setLocalConsent] = useState<CookieConsent>(consent);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const firstFocusableRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setLocalConsent(consent);
  }, [consent]);

  // Focus trap
  useEffect(() => {
    if (open) {
      closeButtonRef.current?.focus();
    }
  }, [open]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && open) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [open, onClose]);

  const handleToggle = (category: keyof Omit<CookieConsent, 'timestamp'>) => {
    if (category === 'necessary') return; // Necessary cookies cannot be toggled

    setLocalConsent((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const handleSave = () => {
    saveConsent(localConsent);
    onClose();
  };

  const handleAcceptAll = () => {
    acceptAll();
    onClose();
  };

  const handleRejectAll = () => {
    rejectAll();
    onClose();
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Tab') {
      const focusableElements = document.querySelectorAll(
        'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      const focusableArray = Array.from(focusableElements);
      const firstElement = focusableArray[0] as HTMLElement;
      const lastElement = focusableArray[focusableArray.length - 1] as HTMLElement;

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement?.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement?.focus();
      }
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="cookie-modal-title"
      aria-describedby="cookie-modal-description"
      aria-modal="true"
      className={styles.modal}
      slotProps={{
        backdrop: {
          className: styles.modalBackdrop,
        },
      }}
    >
      <Box className={styles.modalContent} onKeyDown={handleKeyDown}>
        <Box className={styles.modalHeader}>
          <Typography
            id="cookie-modal-title"
            variant="h5"
            component="h2"
            sx={{ fontWeight: 600 }}
          >
            Cookie Preferences
          </Typography>
          <IconButton
            ref={closeButtonRef}
            onClick={onClose}
            aria-label="Close cookie preferences"
            className={styles.closeButton}
          >
            <CloseIcon />
          </IconButton>
        </Box>

        <Box className={styles.modalBody}>
          <Typography
            id="cookie-modal-description"
            variant="body1"
            sx={{ mb: 3, color: 'text.secondary' }}
          >
            We use cookies to improve your browsing experience, analyze site traffic, and provide personalized content.
            Choose which types of cookies you want to accept.
          </Typography>

          <Box className={styles.categoriesContainer}>
            {COOKIE_CATEGORIES.map((category, index) => (
              <Box key={category.id}>
                <Box className={styles.categoryItem}>
                  <Box className={styles.categoryInfo}>
                    <Typography
                      variant="h6"
                      component="h3"
                      sx={{ fontWeight: 600, fontSize: '1.1rem', mb: 0.5 }}
                    >
                      {category.label}
                      {category.required && (
                        <Typography
                          component="span"
                          sx={{
                            ml: 1,
                            fontSize: '0.75rem',
                            color: 'text.secondary',
                            fontWeight: 400,
                          }}
                        >
                          (Required)
                        </Typography>
                      )}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: 'text.secondary', maxWidth: '600px' }}
                    >
                      {category.description}
                    </Typography>
                  </Box>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={localConsent[category.id]}
                        onChange={() => handleToggle(category.id)}
                        disabled={category.required}
                        color="primary"
                        inputProps={{
                          'aria-label': `${category.label} cookies ${
                            category.required ? '(always enabled)' : ''
                          }`,
                        }}
                      />
                    }
                    label=""
                    sx={{ m: 0 }}
                  />
                </Box>
                {index < COOKIE_CATEGORIES.length - 1 && (
                  <Divider sx={{ my: 2 }} />
                )}
              </Box>
            ))}
          </Box>
        </Box>

        <Box className={styles.modalFooter}>
          <Button
            variant="outlined"
            onClick={handleRejectAll}
            className={styles.footerButton}
            ref={firstFocusableRef}
          >
            Reject All
          </Button>
          <Box sx={{ display: 'flex', gap: 1.5 }}>
            <Button
              variant="outlined"
              onClick={handleAcceptAll}
              className={styles.footerButton}
            >
              Accept All
            </Button>
            <Button
              variant="contained"
              onClick={handleSave}
              className={styles.footerButton}
            >
              Save Preferences
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
}
