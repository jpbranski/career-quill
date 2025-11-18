'use client';

import React, { useState } from 'react';
import {
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  IconButton,
  Divider,
  Grid,
  Collapse,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
} from '@mui/icons-material';
import { Experience, generateId } from '@/lib/resumeModel';

interface ExperienceSectionProps {
  experience: Experience[];
  onChange: (experience: Experience[]) => void;
}

export default function ExperienceSection({ experience, onChange }: ExperienceSectionProps) {
  const [expandedId, setExpandedId] = useState<string | null>(
    experience.length > 0 ? experience[0].id : null
  );

  const handleAdd = () => {
    const newExp: Experience = {
      id: generateId(),
      company: '',
      position: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      bullets: [],
    };
    onChange([...experience, newExp]);
    setExpandedId(newExp.id);
  };

  const handleDelete = (id: string) => {
    onChange(experience.filter((exp) => exp.id !== id));
    if (expandedId === id) {
      setExpandedId(experience.length > 1 ? experience[0].id : null);
    }
  };

  const handleChange = (id: string, field: keyof Experience, value: any) => {
    onChange(
      experience.map((exp) =>
        exp.id === id ? { ...exp, [field]: value } : exp
      )
    );
  };

  const handleBulletChange = (id: string, index: number, value: string) => {
    const exp = experience.find((e) => e.id === id);
    if (!exp) return;

    const newBullets = [...exp.bullets];
    newBullets[index] = value;
    handleChange(id, 'bullets', newBullets);
  };

  const handleAddBullet = (id: string) => {
    const exp = experience.find((e) => e.id === id);
    if (!exp) return;
    handleChange(id, 'bullets', [...exp.bullets, '']);
  };

  const handleDeleteBullet = (id: string, index: number) => {
    const exp = experience.find((e) => e.id === id);
    if (!exp) return;
    const newBullets = exp.bullets.filter((_, i) => i !== index);
    handleChange(id, 'bullets', newBullets);
  };

  return (
    <Paper sx={{ p: 3, mb: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">Experience</Typography>
        <Button startIcon={<AddIcon />} onClick={handleAdd} size="small" variant="outlined">
          Add Experience
        </Button>
      </Box>

      {experience.length === 0 ? (
        <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic', textAlign: 'center', py: 3 }}>
          No experience added yet. Click "Add Experience" to get started.
        </Typography>
      ) : (
        experience.map((exp, index) => (
          <Box key={exp.id} sx={{ mb: index < experience.length - 1 ? 2 : 0 }}>
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
              onClick={() => setExpandedId(expandedId === exp.id ? null : exp.id)}
            >
              <Typography variant="subtitle1" fontWeight={500}>
                {exp.position || 'Untitled Position'} {exp.company && `at ${exp.company}`}
              </Typography>
              <Box>
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(exp.id);
                  }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
                <IconButton size="small">
                  {expandedId === exp.id ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </IconButton>
              </Box>
            </Box>

            <Collapse in={expandedId === exp.id}>
              <Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 1, mt: 1 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Position/Title"
                      value={exp.position}
                      onChange={(e) => handleChange(exp.id, 'position', e.target.value)}
                      placeholder="Software Engineer"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Company"
                      value={exp.company}
                      onChange={(e) => handleChange(exp.id, 'company', e.target.value)}
                      placeholder="Tech Corp"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Location"
                      value={exp.location}
                      onChange={(e) => handleChange(exp.id, 'location', e.target.value)}
                      placeholder="San Francisco, CA"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Start Date"
                      type="month"
                      value={exp.startDate}
                      onChange={(e) => handleChange(exp.id, 'startDate', e.target.value)}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="End Date"
                      type="month"
                      value={exp.endDate}
                      onChange={(e) => handleChange(exp.id, 'endDate', e.target.value)}
                      InputLabelProps={{ shrink: true }}
                      disabled={exp.current}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={exp.current}
                          onChange={(e) => handleChange(exp.id, 'current', e.target.checked)}
                        />
                      }
                      label="I currently work here"
                    />
                  </Grid>
                </Grid>

                <Divider sx={{ my: 2 }} />

                <Typography variant="subtitle2" gutterBottom>
                  Achievements & Responsibilities
                </Typography>
                {exp.bullets.map((bullet, bulletIndex) => (
                  <Box key={bulletIndex} sx={{ display: 'flex', gap: 1, mb: 1 }}>
                    <TextField
                      fullWidth
                      multiline
                      size="small"
                      value={bullet}
                      onChange={(e) => handleBulletChange(exp.id, bulletIndex, e.target.value)}
                      placeholder="Describe your achievement (start with an action verb)..."
                    />
                    <IconButton
                      size="small"
                      onClick={() => handleDeleteBullet(exp.id, bulletIndex)}
                      color="error"
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                ))}
                <Button
                  startIcon={<AddIcon />}
                  onClick={() => handleAddBullet(exp.id)}
                  size="small"
                  sx={{ mt: 1 }}
                >
                  Add Bullet Point
                </Button>
              </Box>
            </Collapse>
          </Box>
        ))
      )}
    </Paper>
  );
}
