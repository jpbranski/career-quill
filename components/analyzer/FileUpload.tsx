'use client';

import React, { useCallback } from 'react';
import { Box, Typography, Paper, Button } from '@mui/material';
import { CloudUpload as UploadIcon, Description as FileIcon } from '@mui/icons-material';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  onTextPaste: (text: string) => void;
}

export default function FileUpload({ onFileSelect, onTextPaste }: FileUploadProps) {
  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (file && (file.type === 'application/pdf' || file.name.endsWith('.docx'))) {
        onFileSelect(file);
      }
    },
    [onFileSelect]
  );

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  };

  return (
    <Paper
      sx={{
        p: 4,
        textAlign: 'center',
        border: '2px dashed',
        borderColor: 'divider',
        bgcolor: 'background.paper',
        transition: 'all 0.2s ease',
        '&:hover': {
          borderColor: 'primary.main',
          bgcolor: 'rgba(200, 126, 66, 0.05)',
        },
      }}
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
    >
      <UploadIcon sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />

      <Typography variant="h6" gutterBottom>
        Upload Your Resume
      </Typography>

      <Typography variant="body2" color="text.secondary" paragraph>
        Drag and drop your resume here, or click to browse
      </Typography>

      <Button
        variant="contained"
        component="label"
        startIcon={<FileIcon />}
        sx={{ mt: 2 }}
      >
        Choose File
        <input
          type="file"
          hidden
          accept=".pdf,.docx"
          onChange={handleFileInput}
        />
      </Button>

      <Typography variant="caption" display="block" color="text.secondary" sx={{ mt: 2 }}>
        Supported formats: PDF, DOCX
      </Typography>
    </Paper>
  );
}
