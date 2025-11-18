'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  Snackbar,
} from '@mui/material';
import { Save as SaveIcon, Refresh as RefreshIcon } from '@mui/icons-material';
import ContactSection from '@/components/builder/ContactSection';
import SummarySection from '@/components/builder/SummarySection';
import SkillsSection from '@/components/builder/SkillsSection';
import ExperienceSection from '@/components/builder/ExperienceSection';
import EducationSection from '@/components/builder/EducationSection';
import ProjectsSection from '@/components/builder/ProjectsSection';
import ExportButtons from '@/components/builder/ExportButtons';
import ResumePreview from '@/components/preview/ResumePreview';
import { Resume, createEmptyResume, createSampleResume } from '@/lib/resumeModel';
import { loadResume, saveResume, autoSaveResume, clearResume } from '@/lib/resumeStorage';

export default function BuilderPage() {
  const [resume, setResume] = useState<Resume | null>(null);
  const [showSaveNotification, setShowSaveNotification] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  // Load resume from localStorage on mount
  useEffect(() => {
    const loaded = loadResume();
    if (loaded) {
      setResume(loaded);
    } else {
      // Show sample resume by default
      setResume(createSampleResume());
    }
  }, []);

  // Auto-save resume when it changes
  useEffect(() => {
    if (resume) {
      autoSaveResume(resume);
    }
  }, [resume]);

  const handleManualSave = () => {
    if (resume) {
      saveResume(resume);
      setShowSaveNotification(true);
    }
  };

  const handleLoadSample = () => {
    if (confirm('Load sample resume? This will replace your current content.')) {
      setResume(createSampleResume());
    }
  };

  const handleClear = () => {
    if (confirm('Clear all resume data? This cannot be undone.')) {
      clearResume();
      setResume(createEmptyResume());
    }
  };

  const handleTemplateChange = (template: Resume['template']) => {
    if (resume) {
      setResume({ ...resume, template });
    }
  };

  if (!resume) {
    return (
      <Container sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h5">Loading...</Typography>
      </Container>
    );
  }

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      {/* Top Bar */}
      <Box
        sx={{
          bgcolor: 'background.paper',
          borderBottom: '1px solid',
          borderColor: 'divider',
          py: 2,
          position: 'sticky',
          top: 64,
          zIndex: 10,
        }}
      >
        <Container maxWidth="xl">
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 2,
            }}
          >
            <Typography variant="h5" fontWeight={600}>
              Resume Builder
            </Typography>

            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
              <FormControl size="small" sx={{ minWidth: 150 }}>
                <InputLabel>Template</InputLabel>
                <Select
                  value={resume.template}
                  label="Template"
                  onChange={(e) => handleTemplateChange(e.target.value as Resume['template'])}
                >
                  <MenuItem value="clean">Clean</MenuItem>
                  <MenuItem value="modern">Modern</MenuItem>
                  <MenuItem value="compact">Compact</MenuItem>
                  <MenuItem value="creative">Creative</MenuItem>
                  <MenuItem value="academic">Academic</MenuItem>
                  <MenuItem value="technical">Technical</MenuItem>
                </Select>
              </FormControl>

              <Button
                startIcon={<SaveIcon />}
                onClick={handleManualSave}
                variant="outlined"
                size="small"
              >
                Save
              </Button>

              <Button
                startIcon={<RefreshIcon />}
                onClick={handleLoadSample}
                variant="outlined"
                size="small"
              >
                Load Sample
              </Button>

              <ExportButtons resume={resume} previewRef={previewRef} />
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Main Content */}
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Grid container spacing={3}>
          {/* Editor Panel */}
          <Grid item xs={12} lg={5}>
            <Box sx={{ position: 'sticky', top: 150, maxHeight: 'calc(100vh - 180px)', overflowY: 'auto', pr: 2 }}>
              <ContactSection
                contact={resume.contact}
                onChange={(contact) => setResume({ ...resume, contact })}
              />

              <SummarySection
                summary={resume.summary}
                onChange={(summary) => setResume({ ...resume, summary })}
              />

              <SkillsSection
                skills={resume.skills}
                onChange={(skills) => setResume({ ...resume, skills })}
              />

              <ExperienceSection
                experience={resume.experience}
                onChange={(experience) => setResume({ ...resume, experience })}
              />

              <EducationSection
                education={resume.education}
                onChange={(education) => setResume({ ...resume, education })}
              />

              <ProjectsSection
                projects={resume.projects}
                onChange={(projects) => setResume({ ...resume, projects })}
              />

              <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={handleClear}
                  fullWidth
                >
                  Clear All
                </Button>
              </Box>
            </Box>
          </Grid>

          {/* Preview Panel */}
          <Grid item xs={12} lg={7}>
            <Box
              sx={{
                position: 'sticky',
                top: 150,
                display: 'flex',
                justifyContent: 'center',
                bgcolor: '#f5f5f5',
                p: 3,
                borderRadius: 2,
                minHeight: 'calc(100vh - 180px)',
                overflowY: 'auto',
              }}
            >
              <ResumePreview ref={previewRef} resume={resume} />
            </Box>
          </Grid>
        </Grid>
      </Container>

      {/* Save Notification */}
      <Snackbar
        open={showSaveNotification}
        autoHideDuration={2000}
        onClose={() => setShowSaveNotification(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" sx={{ width: '100%' }}>
          Resume saved successfully!
        </Alert>
      </Snackbar>
    </Box>
  );
}
