'use client';

import React from 'react';
import {
  Box,
  Typography,
  Paper,
  LinearProgress,
  Grid,
  Card,
  CardContent,
  Chip,
} from '@mui/material';
import {
  CheckCircle as CheckIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';
import { AnalysisResult } from '@/lib/analyzer';

interface AnalysisResultsProps {
  analysis: AnalysisResult;
}

export default function AnalysisResults({ analysis }: AnalysisResultsProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'success';
    if (score >= 60) return 'warning';
    return 'error';
  };

  const getScoreMessage = (score: number) => {
    if (score >= 80) return 'Excellent!';
    if (score >= 60) return 'Good, but can improve';
    return 'Needs improvement';
  };

  return (
    <Box>
      {/* Overall Score */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6">Overall Score</Typography>
          <Chip
            label={getScoreMessage(analysis.score)}
            color={getScoreColor(analysis.score) as any}
            icon={<TrendingUpIcon />}
          />
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{ flex: 1 }}>
            <LinearProgress
              variant="determinate"
              value={analysis.score}
              color={getScoreColor(analysis.score) as any}
              sx={{ height: 10, borderRadius: 5 }}
            />
          </Box>
          <Typography variant="h4" fontWeight={700} color={`${getScoreColor(analysis.score)}.main`}>
            {analysis.score}
          </Typography>
        </Box>
      </Paper>

      {/* Quick Stats */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={6} sm={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="primary">
                {analysis.wordCount}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Words
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="primary">
                {analysis.readingTimeMinutes}m
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Read Time
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="primary">
                {analysis.metrics.bulletCount}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Bullets
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="primary">
                {analysis.metrics.actionVerbCount}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Action Verbs
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Metrics Details */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Resume Structure
        </Typography>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12} sm={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              {analysis.metrics.hasContactInfo ? (
                <CheckIcon color="success" />
              ) : (
                <WarningIcon color="error" />
              )}
              <Typography variant="body2">Contact Information</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              {analysis.metrics.hasSummary ? (
                <CheckIcon color="success" />
              ) : (
                <InfoIcon color="warning" />
              )}
              <Typography variant="body2">Professional Summary</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              {analysis.metrics.hasSkills ? (
                <CheckIcon color="success" />
              ) : (
                <WarningIcon color="warning" />
              )}
              <Typography variant="body2">Skills Section</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              {analysis.metrics.hasExperience ? (
                <CheckIcon color="success" />
              ) : (
                <WarningIcon color="error" />
              )}
              <Typography variant="body2">Work Experience</Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Quantification Stats */}
      {analysis.metrics.bulletCount > 0 && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Content Quality
          </Typography>
          <Box sx={{ mt: 2 }}>
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">Quantified Achievements</Typography>
                <Typography variant="body2" fontWeight={600}>
                  {Math.round((analysis.metrics.quantifiedBullets / analysis.metrics.bulletCount) * 100)}%
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={(analysis.metrics.quantifiedBullets / analysis.metrics.bulletCount) * 100}
                color={analysis.metrics.quantifiedBullets / analysis.metrics.bulletCount >= 0.4 ? 'success' : 'warning'}
              />
            </Box>
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">Action Verbs Used</Typography>
                <Typography variant="body2" fontWeight={600}>
                  {Math.round((analysis.metrics.actionVerbCount / analysis.metrics.bulletCount) * 100)}%
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={(analysis.metrics.actionVerbCount / analysis.metrics.bulletCount) * 100}
                color={analysis.metrics.actionVerbCount / analysis.metrics.bulletCount >= 0.6 ? 'success' : 'warning'}
              />
            </Box>
          </Box>
        </Paper>
      )}
    </Box>
  );
}
