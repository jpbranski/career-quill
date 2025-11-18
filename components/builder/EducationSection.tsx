'use client';

import React, { useState } from 'react';
import {
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  IconButton,
  Grid,
  Collapse,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
} from '@mui/icons-material';
import { Education, generateId } from '@/lib/resumeModel';

interface EducationSectionProps {
  education: Education[];
  onChange: (education: Education[]) => void;
}

export default function EducationSection({ education, onChange }: EducationSectionProps) {
  const [expandedId, setExpandedId] = useState<string | null>(
    education.length > 0 ? education[0].id : null
  );

  const handleAdd = () => {
    const newEdu: Education = {
      id: generateId(),
      institution: '',
      degree: '',
      field: '',
      location: '',
      startDate: '',
      endDate: '',
      gpa: '',
      honors: '',
    };
    onChange([...education, newEdu]);
    setExpandedId(newEdu.id);
  };

  const handleDelete = (id: string) => {
    onChange(education.filter((edu) => edu.id !== id));
  };

  const handleChange = (id: string, field: keyof Education, value: any) => {
    onChange(
      education.map((edu) =>
        edu.id === id ? { ...edu, [field]: value } : edu
      )
    );
  };

  return (
    <Paper sx={{ p: 3, mb: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">Education</Typography>
        <Button startIcon={<AddIcon />} onClick={handleAdd} size="small" variant="outlined">
          Add Education
        </Button>
      </Box>

      {education.length === 0 ? (
        <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic', textAlign: 'center', py: 3 }}>
          No education added yet. Click "Add Education" to get started.
        </Typography>
      ) : (
        education.map((edu, index) => (
          <Box key={edu.id} sx={{ mb: index < education.length - 1 ? 2 : 0 }}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                p: 1.5,
                bgcolor: 'background.default',
                borderRadius: 1,
                cursor: 'pointer',
              }}
              onClick={() => setExpandedId(expandedId === edu.id ? null : edu.id)}
            >
              <Typography variant="subtitle1" fontWeight={500}>
                {edu.degree || 'Untitled Degree'} {edu.field && `in ${edu.field}`}
              </Typography>
              <Box>
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(edu.id);
                  }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
                <IconButton size="small">
                  {expandedId === edu.id ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </IconButton>
              </Box>
            </Box>

            <Collapse in={expandedId === edu.id}>
              <Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 1, mt: 1 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Institution"
                      value={edu.institution}
                      onChange={(e) => handleChange(edu.id, 'institution', e.target.value)}
                      placeholder="University of California, Berkeley"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Degree"
                      value={edu.degree}
                      onChange={(e) => handleChange(edu.id, 'degree', e.target.value)}
                      placeholder="Bachelor of Science"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Field of Study"
                      value={edu.field}
                      onChange={(e) => handleChange(edu.id, 'field', e.target.value)}
                      placeholder="Computer Science"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Location"
                      value={edu.location}
                      onChange={(e) => handleChange(edu.id, 'location', e.target.value)}
                      placeholder="Berkeley, CA"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Start Date"
                      type="month"
                      value={edu.startDate}
                      onChange={(e) => handleChange(edu.id, 'startDate', e.target.value)}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="End Date"
                      type="month"
                      value={edu.endDate}
                      onChange={(e) => handleChange(edu.id, 'endDate', e.target.value)}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="GPA (optional)"
                      value={edu.gpa || ''}
                      onChange={(e) => handleChange(edu.id, 'gpa', e.target.value)}
                      placeholder="3.8"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Honors (optional)"
                      value={edu.honors || ''}
                      onChange={(e) => handleChange(edu.id, 'honors', e.target.value)}
                      placeholder="Magna Cum Laude"
                    />
                  </Grid>
                </Grid>
              </Box>
            </Collapse>
          </Box>
        ))
      )}
    </Paper>
  );
}
