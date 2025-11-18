'use client';

import React from 'react';
import { TextField, Grid, Paper, Typography, Box } from '@mui/material';
import { ContactInfo } from '@/lib/resumeModel';

interface ContactSectionProps {
  contact: ContactInfo;
  onChange: (contact: ContactInfo) => void;
}

export default function ContactSection({ contact, onChange }: ContactSectionProps) {
  const handleChange = (field: keyof ContactInfo, value: string) => {
    onChange({
      ...contact,
      [field]: value,
    });
  };

  return (
    <Paper sx={{ p: 3, mb: 2 }}>
      <Typography variant="h6" gutterBottom>
        Contact Information
      </Typography>
      <Box sx={{ mt: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Full Name"
              value={contact.fullName}
              onChange={(e) => handleChange('fullName', e.target.value)}
              placeholder="John Doe"
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={contact.email}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="john@example.com"
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Phone"
              type="tel"
              value={contact.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              placeholder="(555) 123-4567"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Location"
              value={contact.location}
              onChange={(e) => handleChange('location', e.target.value)}
              placeholder="San Francisco, CA"
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="LinkedIn"
              value={contact.linkedin || ''}
              onChange={(e) => handleChange('linkedin', e.target.value)}
              placeholder="linkedin.com/in/johndoe"
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Website"
              value={contact.website || ''}
              onChange={(e) => handleChange('website', e.target.value)}
              placeholder="johndoe.com"
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="GitHub"
              value={contact.github || ''}
              onChange={(e) => handleChange('github', e.target.value)}
              placeholder="github.com/johndoe"
            />
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
}
