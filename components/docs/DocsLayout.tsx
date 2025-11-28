'use client';

import { ReactNode } from 'react';
import { Box, Container, useMediaQuery, useTheme } from '@mui/material';
import DocsSidebar from './DocsSidebar';

interface DocsLayoutProps {
  children: ReactNode;
  currentCategory?: string;
  currentSlug?: string;
}

export default function DocsLayout({ children, currentCategory, currentSlug }: DocsLayoutProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Box
      sx={{
        display: 'flex',
        minHeight: 'calc(100vh - 64px)', // Subtract header height
        pt: '64px' // Account for fixed header
      }}
    >
      {/* Sidebar - Hide on mobile for now (can add drawer later) */}
      {!isMobile && (
        <DocsSidebar currentCategory={currentCategory} currentSlug={currentSlug} />
      )}

      {/* Main Content Area */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: 'background.default',
          minHeight: '100vh',
          overflowX: 'hidden'
        }}
      >
        <Container
          maxWidth="lg"
          sx={{
            py: { xs: 3, md: 6 },
            px: { xs: 2, sm: 3, md: 4 }
          }}
        >
          {children}
        </Container>
      </Box>
    </Box>
  );
}
