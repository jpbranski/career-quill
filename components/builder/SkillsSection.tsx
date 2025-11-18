'use client';

import React, { useState } from 'react';
import { Paper, Typography, Box, TextField, Chip, Stack } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';

interface SkillsSectionProps {
  skills: string[];
  onChange: (skills: string[]) => void;
}

export default function SkillsSection({ skills, onChange }: SkillsSectionProps) {
  const [inputValue, setInputValue] = useState('');

  const handleAdd = () => {
    const trimmed = inputValue.trim();
    if (trimmed && !skills.includes(trimmed)) {
      onChange([...skills, trimmed]);
      setInputValue('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAdd();
    }
  };

  const handleDelete = (skillToDelete: string) => {
    onChange(skills.filter((skill) => skill !== skillToDelete));
  };

  return (
    <Paper sx={{ p: 3, mb: 2 }}>
      <Typography variant="h6" gutterBottom>
        Skills
      </Typography>
      <Box sx={{ mt: 2 }}>
        <TextField
          fullWidth
          label="Add a skill"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="e.g., JavaScript, Python, React..."
          helperText="Press Enter to add"
          InputProps={{
            endAdornment: (
              <AddIcon
                sx={{ cursor: 'pointer', color: 'primary.main' }}
                onClick={handleAdd}
              />
            ),
          }}
        />
        <Stack direction="row" spacing={1} flexWrap="wrap" gap={1} sx={{ mt: 2 }}>
          {skills.map((skill, index) => (
            <Chip
              key={index}
              label={skill}
              onDelete={() => handleDelete(skill)}
              color="primary"
              variant="outlined"
            />
          ))}
        </Stack>
        {skills.length === 0 && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2, fontStyle: 'italic' }}>
            No skills added yet. Add your technical and soft skills above.
          </Typography>
        )}
      </Box>
    </Paper>
  );
}
