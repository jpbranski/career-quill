'use client';

import { ReactNode } from 'react';
import { Box, Typography, Chip, Stack, Divider } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';

interface ArticleContentProps {
  title: string;
  description: string;
  keywords?: string[];
  readingTime?: number;
  lastUpdated?: string;
  children: ReactNode;
}

export default function ArticleContent({
  title,
  description,
  keywords = [],
  readingTime,
  lastUpdated,
  children
}: ArticleContentProps) {
  return (
    <Box>
      {/* Article Header */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h3"
          component="h1"
          sx={{
            fontWeight: 700,
            mb: 2,
            fontSize: { xs: '2rem', md: '2.5rem' },
            lineHeight: 1.2
          }}
        >
          {title}
        </Typography>

        <Typography
          variant="h6"
          component="p"
          sx={{
            color: 'text.secondary',
            mb: 3,
            fontWeight: 400,
            lineHeight: 1.6
          }}
        >
          {description}
        </Typography>

        {/* Meta Information */}
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          sx={{ mb: 2 }}
          alignItems={{ xs: 'flex-start', sm: 'center' }}
        >
          {readingTime && (
            <Stack direction="row" spacing={0.5} alignItems="center">
              <AccessTimeIcon fontSize="small" color="action" />
              <Typography variant="body2" color="text.secondary">
                {readingTime} min read
              </Typography>
            </Stack>
          )}

          {lastUpdated && (
            <Typography variant="body2" color="text.secondary">
              Updated: {lastUpdated}
            </Typography>
          )}
        </Stack>

        {/* Keywords */}
        {keywords.length > 0 && (
          <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ gap: 1 }}>
            <LocalOfferIcon fontSize="small" sx={{ color: 'text.secondary', mt: 0.5 }} />
            {keywords.slice(0, 5).map((keyword, idx) => (
              <Chip
                key={idx}
                label={keyword}
                size="small"
                variant="outlined"
                sx={{ borderRadius: 1 }}
              />
            ))}
          </Stack>
        )}
      </Box>

      <Divider sx={{ mb: 4 }} />

      {/* Ad Slot - Top of Article */}
      <Box
        id="ad-top"
        sx={{
          mb: 4,
          minHeight: 100,
          bgcolor: 'action.hover',
          borderRadius: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '1px dashed',
          borderColor: 'divider'
        }}
      >
        <Typography variant="caption" color="text.secondary">
          Advertisement
        </Typography>
      </Box>

      {/* Article Content */}
      <Box
        sx={{
          '& h2': {
            fontSize: { xs: '1.75rem', md: '2rem' },
            fontWeight: 700,
            mt: 5,
            mb: 2.5,
            lineHeight: 1.3,
            color: 'text.primary'
          },
          '& h3': {
            fontSize: { xs: '1.5rem', md: '1.75rem' },
            fontWeight: 600,
            mt: 4,
            mb: 2,
            lineHeight: 1.4,
            color: 'text.primary'
          },
          '& h4': {
            fontSize: { xs: '1.25rem', md: '1.5rem' },
            fontWeight: 600,
            mt: 3,
            mb: 1.5,
            lineHeight: 1.4,
            color: 'text.primary'
          },
          '& p': {
            fontSize: { xs: '1rem', md: '1.125rem' },
            lineHeight: 1.8,
            mb: 2.5,
            color: 'text.primary'
          },
          '& ul, & ol': {
            fontSize: { xs: '1rem', md: '1.125rem' },
            lineHeight: 1.8,
            mb: 2.5,
            pl: { xs: 3, md: 4 }
          },
          '& li': {
            mb: 1,
            color: 'text.primary'
          },
          '& strong': {
            fontWeight: 700,
            color: 'text.primary'
          },
          '& em': {
            fontStyle: 'italic'
          },
          '& code': {
            bgcolor: 'action.hover',
            px: 0.75,
            py: 0.25,
            borderRadius: 0.5,
            fontSize: '0.9em',
            fontFamily: 'monospace'
          },
          '& blockquote': {
            borderLeft: '4px solid',
            borderColor: 'primary.main',
            pl: 3,
            py: 1,
            my: 3,
            bgcolor: 'action.hover',
            fontStyle: 'italic',
            '& p': {
              mb: 0
            }
          },
          '& .callout': {
            bgcolor: 'primary.main',
            color: 'primary.contrastText',
            p: 2.5,
            borderRadius: 1,
            my: 3,
            '& p:last-child': {
              mb: 0
            }
          },
          '& .warning': {
            bgcolor: 'warning.light',
            color: 'warning.contrastText',
            p: 2.5,
            borderRadius: 1,
            my: 3,
            border: '1px solid',
            borderColor: 'warning.main'
          },
          '& .tip': {
            bgcolor: 'success.light',
            color: 'success.contrastText',
            p: 2.5,
            borderRadius: 1,
            my: 3,
            border: '1px solid',
            borderColor: 'success.main'
          }
        }}
      >
        {children}
      </Box>

      {/* Ad Slot - Bottom of Article */}
      <Box
        id="ad-bottom"
        sx={{
          mt: 6,
          mb: 4,
          minHeight: 100,
          bgcolor: 'action.hover',
          borderRadius: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '1px dashed',
          borderColor: 'divider'
        }}
      >
        <Typography variant="caption" color="text.secondary">
          Advertisement
        </Typography>
      </Box>
    </Box>
  );
}
