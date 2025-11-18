'use client';

import React, { useState, useRef } from 'react';
import { Box, Button, Menu, MenuItem, CircularProgress } from '@mui/material';
import { Download as DownloadIcon } from '@mui/icons-material';
import { Resume } from '@/lib/resumeModel';
import { exportAsTxt, exportAsDocx } from '@/lib/exportUtils';
import { useReactToPrint } from 'react-to-print';

interface ExportButtonsProps {
  resume: Resume;
  previewRef: React.RefObject<HTMLDivElement | null>;
}

export default function ExportButtons({ resume, previewRef }: ExportButtonsProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [loading, setLoading] = useState(false);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handlePrint = useReactToPrint({
    contentRef: previewRef,
    documentTitle: `${resume.contact.fullName || 'resume'}-${Date.now()}`,
  });

  const handleExportPDF = () => {
    handleClose();
    handlePrint();
  };

  const handleExportTXT = () => {
    handleClose();
    exportAsTxt(resume);
  };

  const handleExportDOCX = async () => {
    handleClose();
    setLoading(true);
    try {
      await exportAsDocx(resume);
    } catch (error) {
      console.error('Failed to export DOCX:', error);
      alert('Failed to export DOCX. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Button
        variant="contained"
        startIcon={loading ? <CircularProgress size={20} /> : <DownloadIcon />}
        onClick={handleClick}
        disabled={loading}
        sx={{
          background: 'linear-gradient(135deg, #5A64B3 0%, #8B92D9 100%)',
          '&:hover': {
            background: 'linear-gradient(135deg, #3F4682 0%, #5A64B3 100%)',
          },
        }}
      >
        Export Resume
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'export-button',
        }}
      >
        <MenuItem onClick={handleExportPDF}>
          Export as PDF
        </MenuItem>
        <MenuItem onClick={handleExportDOCX}>
          Export as DOCX
        </MenuItem>
        <MenuItem onClick={handleExportTXT}>
          Export as TXT
        </MenuItem>
      </Menu>
    </Box>
  );
}
