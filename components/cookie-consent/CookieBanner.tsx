'use client';

import React, { useState } from 'react';
import { Box, Button, Typography, Container } from '@mui/material';
import CookieModal from './CookieModal';
import { useCookieConsent } from './useCookieConsent';
import styles from './styles.module.css';

export default function CookieBanner() {
  const { showBanner, acceptAll, rejectAll } = useCookieConsent();
  const [showModal, setShowModal] = useState(false);

  if (!showBanner) {
    return null;
  }

  const handleCustomize = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <>
      <Box
        role="dialog"
        aria-labelledby="cookie-banner-title"
        aria-describedby="cookie-banner-description"
        className={styles.banner}
      >
        <Container maxWidth="lg">
          <Box className={styles.bannerContent}>
            <Box className={styles.bannerText}>
              <Typography
                id="cookie-banner-title"
                variant="h6"
                component="h2"
                sx={{ fontWeight: 600, mb: 0.5 }}
              >
                Cookie Preferences
              </Typography>
              <Typography
                id="cookie-banner-description"
                variant="body2"
                sx={{ color: 'text.secondary' }}
              >
                We use cookies to enhance your experience, analyze site traffic, and serve personalized content.
                You can customize your preferences or accept all cookies.
              </Typography>
            </Box>
            <Box className={styles.bannerActions}>
              <Button
                variant="outlined"
                onClick={handleCustomize}
                className={styles.customizeButton}
                aria-label="Customize cookie preferences"
              >
                Customize
              </Button>
              <Button
                variant="outlined"
                onClick={rejectAll}
                className={styles.rejectButton}
                aria-label="Reject all non-essential cookies"
              >
                Reject All
              </Button>
              <Button
                variant="contained"
                onClick={acceptAll}
                className={styles.acceptButton}
                aria-label="Accept all cookies"
              >
                Accept All
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>

      {showModal && <CookieModal open={showModal} onClose={handleCloseModal} />}
    </>
  );
}
