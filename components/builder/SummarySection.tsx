'use client';

import React from 'react';
import { TextField, Paper, Typography, Box } from '@mui/material';

interface SummarySectionProps {
  summary: string;
  onChange: (summary: string) => void;
}

export default function SummarySection({ summary, onChange }: SummarySectionProps) {
  return (
    <Paper sx={{ p: 3, mb: 2 }}>
      <Typography variant="h6" gutterBottom>
        Professional Summary
      </Typography>
      <Box sx={{ mt: 2 }}>
        <TextField
          fullWidth
          multiline
          rows={4}
          label="Summary"
          value={summary}
          onChange={(e) => onChange(e.target.value)}
          placeholder="A brief professional summary highlighting your key achievements and career goals..."
          helperText={`${summary.length} characters • Aim for 200-400 characters`}
        />
      </Box>
    </Paper>
  );
}
