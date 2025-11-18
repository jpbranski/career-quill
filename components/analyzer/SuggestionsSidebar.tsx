'use client';

import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Alert,
  AlertTitle,
  Chip,
  Divider,
} from '@mui/material';
import {
  Error as ErrorIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  CheckCircle as SuccessIcon,
} from '@mui/icons-material';
import { Suggestion } from '@/lib/analyzer';

interface SuggestionsSidebarProps {
  suggestions: Suggestion[];
}

export default function SuggestionsSidebar({ suggestions }: SuggestionsSidebarProps) {
  const getSeverityIcon = (type: Suggestion['type']) => {
    switch (type) {
      case 'error':
        return <ErrorIcon />;
      case 'warning':
        return <WarningIcon />;
      case 'success':
        return <SuccessIcon />;
      default:
        return <InfoIcon />;
    }
  };

  const getCategoryColor = (category: Suggestion['category']) => {
    switch (category) {
      case 'structure':
        return 'primary';
      case 'content':
        return 'secondary';
      case 'formatting':
        return 'info';
      case 'keywords':
        return 'success';
      default:
        return 'default';
    }
  };

  if (suggestions.length === 0) {
    return (
      <Paper sx={{ p: 3 }}>
        <Alert severity="success" icon={<SuccessIcon />}>
          <AlertTitle>Great job!</AlertTitle>
          No major issues found. Your resume looks good!
        </Alert>
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Suggestions ({suggestions.length})
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        Here are some ways to improve your resume:
      </Typography>

      <Divider sx={{ my: 2 }} />

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {suggestions.map((suggestion) => (
          <Alert
            key={suggestion.id}
            severity={suggestion.type}
            icon={getSeverityIcon(suggestion.type)}
            sx={{
              '& .MuiAlert-message': {
                width: '100%',
              },
            }}
          >
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 0.5 }}>
                <AlertTitle sx={{ mb: 0.5 }}>{suggestion.title}</AlertTitle>
                <Chip
                  label={suggestion.category}
                  size="small"
                  color={getCategoryColor(suggestion.category) as any}
                  sx={{ ml: 1 }}
                />
              </Box>
              <Typography variant="body2">{suggestion.description}</Typography>
            </Box>
          </Alert>
        ))}
      </Box>

      <Box sx={{ mt: 3, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
        <Typography variant="caption" color="text.secondary">
          💡 Tip: Focus on high-priority suggestions first for the biggest impact.
        </Typography>
      </Box>
    </Paper>
  );
}
