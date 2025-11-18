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
  Chip,
  Stack,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
} from '@mui/icons-material';
import { Project, generateId } from '@/lib/resumeModel';

interface ProjectsSectionProps {
  projects: Project[];
  onChange: (projects: Project[]) => void;
}

export default function ProjectsSection({ projects, onChange }: ProjectsSectionProps) {
  const [expandedId, setExpandedId] = useState<string | null>(
    projects.length > 0 ? projects[0].id : null
  );
  const [techInput, setTechInput] = useState<{ [key: string]: string }>({});

  const handleAdd = () => {
    const newProj: Project = {
      id: generateId(),
      name: '',
      description: '',
      technologies: [],
      link: '',
      bullets: [],
    };
    onChange([...projects, newProj]);
    setExpandedId(newProj.id);
  };

  const handleDelete = (id: string) => {
    onChange(projects.filter((proj) => proj.id !== id));
  };

  const handleChange = (id: string, field: keyof Project, value: any) => {
    onChange(
      projects.map((proj) =>
        proj.id === id ? { ...proj, [field]: value } : proj
      )
    );
  };

  const handleAddTech = (id: string) => {
    const input = techInput[id]?.trim();
    const proj = projects.find((p) => p.id === id);
    if (!input || !proj || proj.technologies.includes(input)) return;

    handleChange(id, 'technologies', [...proj.technologies, input]);
    setTechInput({ ...techInput, [id]: '' });
  };

  const handleDeleteTech = (id: string, tech: string) => {
    const proj = projects.find((p) => p.id === id);
    if (!proj) return;
    handleChange(id, 'technologies', proj.technologies.filter((t) => t !== tech));
  };

  const handleBulletChange = (id: string, index: number, value: string) => {
    const proj = projects.find((p) => p.id === id);
    if (!proj) return;
    const newBullets = [...proj.bullets];
    newBullets[index] = value;
    handleChange(id, 'bullets', newBullets);
  };

  const handleAddBullet = (id: string) => {
    const proj = projects.find((p) => p.id === id);
    if (!proj) return;
    handleChange(id, 'bullets', [...proj.bullets, '']);
  };

  const handleDeleteBullet = (id: string, index: number) => {
    const proj = projects.find((p) => p.id === id);
    if (!proj) return;
    handleChange(id, 'bullets', proj.bullets.filter((_, i) => i !== index));
  };

  return (
    <Paper sx={{ p: 3, mb: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">Projects</Typography>
        <Button startIcon={<AddIcon />} onClick={handleAdd} size="small" variant="outlined">
          Add Project
        </Button>
      </Box>

      {projects.length === 0 ? (
        <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic', textAlign: 'center', py: 3 }}>
          No projects added yet. Click "Add Project" to get started.
        </Typography>
      ) : (
        projects.map((proj, index) => (
          <Box key={proj.id} sx={{ mb: index < projects.length - 1 ? 2 : 0 }}>
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
              onClick={() => setExpandedId(expandedId === proj.id ? null : proj.id)}
            >
              <Typography variant="subtitle1" fontWeight={500}>
                {proj.name || 'Untitled Project'}
              </Typography>
              <Box>
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(proj.id);
                  }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
                <IconButton size="small">
                  {expandedId === proj.id ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </IconButton>
              </Box>
            </Box>

            <Collapse in={expandedId === proj.id}>
              <Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 1, mt: 1 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Project Name"
                      value={proj.name}
                      onChange={(e) => handleChange(proj.id, 'name', e.target.value)}
                      placeholder="My Awesome Project"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      multiline
                      rows={2}
                      label="Description"
                      value={proj.description}
                      onChange={(e) => handleChange(proj.id, 'description', e.target.value)}
                      placeholder="Brief project description..."
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Project Link (optional)"
                      value={proj.link || ''}
                      onChange={(e) => handleChange(proj.id, 'link', e.target.value)}
                      placeholder="github.com/username/project"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Add Technology"
                      value={techInput[proj.id] || ''}
                      onChange={(e) => setTechInput({ ...techInput, [proj.id]: e.target.value })}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddTech(proj.id);
                        }
                      }}
                      placeholder="React, Node.js, etc."
                      helperText="Press Enter to add"
                      InputProps={{
                        endAdornment: (
                          <AddIcon
                            sx={{ cursor: 'pointer', color: 'primary.main' }}
                            onClick={() => handleAddTech(proj.id)}
                          />
                        ),
                      }}
                    />
                    <Stack direction="row" spacing={1} flexWrap="wrap" gap={1} sx={{ mt: 1 }}>
                      {proj.technologies.map((tech, idx) => (
                        <Chip
                          key={idx}
                          label={tech}
                          onDelete={() => handleDeleteTech(proj.id, tech)}
                          size="small"
                          color="secondary"
                          variant="outlined"
                        />
                      ))}
                    </Stack>
                  </Grid>
                </Grid>

                <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>
                  Key Points
                </Typography>
                {proj.bullets.map((bullet, bulletIndex) => (
                  <Box key={bulletIndex} sx={{ display: 'flex', gap: 1, mb: 1 }}>
                    <TextField
                      fullWidth
                      multiline
                      size="small"
                      value={bullet}
                      onChange={(e) => handleBulletChange(proj.id, bulletIndex, e.target.value)}
                      placeholder="Describe a key feature or achievement..."
                    />
                    <IconButton
                      size="small"
                      onClick={() => handleDeleteBullet(proj.id, bulletIndex)}
                      color="error"
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                ))}
                <Button
                  startIcon={<AddIcon />}
                  onClick={() => handleAddBullet(proj.id)}
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
