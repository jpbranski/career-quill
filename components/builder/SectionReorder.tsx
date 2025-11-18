'use client';

import React from 'react';
import { Paper, Typography, Box } from '@mui/material';
import { ResumeSection } from '@/lib/resumeModel';

interface SectionReorderProps {
  sections: ResumeSection[];
  onChange: (sections: ResumeSection[]) => void;
}

export default function SectionReorder({ sections, onChange }: SectionReorderProps) {
  // This is a simplified version. For production, you'd use @hello-pangea/dnd
  // For now, we'll just show the current order
  return (
    <Paper sx={{ p: 3, mb: 2 }}>
      <Typography variant="h6" gutterBottom>
        Section Order
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Sections are displayed in the following order:
      </Typography>
      <Box sx={{ mt: 2 }}>
        {sections
          .sort((a, b) => a.order - b.order)
          .map((section, index) => (
            <Box
              key={section.id}
              sx={{
                p: 1.5,
                mb: 1,
                bgcolor: 'background.default',
                borderRadius: 1,
                display: 'flex',
                alignItems: 'center',
                gap: 2,
              }}
            >
              <Typography variant="body2" sx={{ fontWeight: 500, minWidth: 20 }}>
                {index + 1}.
              </Typography>
              <Typography variant="body2">{section.title}</Typography>
            </Box>
          ))}
      </Box>
      <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
        Drag-and-drop reordering coming soon!
      </Typography>
    </Paper>
  );
}
