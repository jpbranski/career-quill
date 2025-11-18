'use client';

import React, { useEffect, useState } from 'react';
import { IconButton, Tooltip } from '@mui/material';
import { Brightness4, Brightness7 } from '@mui/icons-material';

interface ThemeToggleProps {
  mode: 'light' | 'dark';
  onToggle: () => void;
}

export default function ThemeToggle({ mode, onToggle }: ThemeToggleProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <Tooltip title={`Switch to ${mode === 'dark' ? 'light' : 'dark'} mode`}>
      <IconButton
        onClick={onToggle}
        aria-label={`Switch to ${mode === 'dark' ? 'light' : 'dark'} mode`}
        sx={{
          color: 'text.primary',
          transition: 'transform 0.2s ease',
          '&:hover': {
            transform: 'rotate(180deg)',
          },
        }}
      >
        {mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
      </IconButton>
    </Tooltip>
  );
}
