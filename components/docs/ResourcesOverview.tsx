'use client';

import Link from 'next/link';
import { Box, Typography, Stack, Divider, Button } from '@mui/material';
import ArticleIcon from '@mui/icons-material/Article';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { categories, getArticlesByCategory } from '@/lib/docsConfig';

export default function ResourcesOverview() {
  return (
    <Box>
      {/* Introduction */}
      <Typography variant="h3" component="h1" sx={{ fontWeight: 700, mb: 3 }}>
        Career Resources
      </Typography>

      <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.8, fontSize: '1.125rem' }}>
        Welcome to the Career Quill Resources Hub—your comprehensive guide to mastering every aspect
        of the job search process. Whether you're crafting your first resume, optimizing for
        applicant tracking systems, or preparing for interviews, you'll find expert guidance and
        practical strategies here.
      </Typography>

      <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.8, fontSize: '1.125rem' }}>
        These resources complement our Resume Builder and Analyzer tools, providing the knowledge
        you need to create compelling applications and navigate your career journey with confidence.
        Each article is designed for easy scanning with clear structure, actionable advice, and
        real-world examples.
      </Typography>

      <Typography variant="body1" sx={{ mb: 4, lineHeight: 1.8, fontSize: '1.125rem' }}>
        Browse by category below, use the search bar in the sidebar to find specific topics, or
        explore related articles within each section. All content is regularly updated to reflect
        current best practices and market trends.
      </Typography>

      <Divider sx={{ my: 4 }} />

      {/* Categories List */}
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>
        Explore by Category
      </Typography>

      <Stack spacing={3}>
        {categories
          .sort((a, b) => a.order - b.order)
          .map((category) => {
            const categoryArticles = getArticlesByCategory(category.id);
            const firstArticle = categoryArticles[0];

            return (
              <Box
                key={category.id}
                sx={{
                  p: 3,
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 2,
                  transition: 'all 0.2s',
                  '&:hover': {
                    borderColor: 'primary.main',
                    boxShadow: 2
                  }
                }}
              >
                <Stack direction="row" spacing={2} alignItems="flex-start">
                  {/* Icon */}
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: 1.5,
                      bgcolor: 'primary.main',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}
                  >
                    <ArticleIcon sx={{ fontSize: 24, color: 'primary.contrastText' }} />
                  </Box>

                  {/* Content */}
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                      {category.name}
                    </Typography>

                    <Typography
                      variant="body1"
                      color="text.secondary"
                      sx={{ mb: 2, lineHeight: 1.7 }}
                    >
                      {category.description}
                    </Typography>

                    <Stack direction="row" spacing={2} alignItems="center">
                      <Typography variant="body2" color="text.secondary">
                        {categoryArticles.length} article{categoryArticles.length !== 1 ? 's' : ''}
                      </Typography>

                      {firstArticle && (
                        <Button
                          component={Link}
                          href={`/resources/${firstArticle.category}/${firstArticle.slug}`}
                          variant="text"
                          endIcon={<ArrowForwardIcon />}
                          sx={{
                            fontWeight: 600,
                            '&:hover': {
                              bgcolor: 'rgba(200, 126, 66, 0.1)'
                            }
                          }}
                        >
                          View Articles
                        </Button>
                      )}
                    </Stack>
                  </Box>
                </Stack>
              </Box>
            );
          })}
      </Stack>

      {/* Bottom CTA */}
      <Box
        sx={{
          mt: 6,
          p: 4,
          borderRadius: 2,
          background: 'linear-gradient(135deg, rgba(200, 126, 66, 0.1) 0%, rgba(90, 100, 179, 0.1) 100%)',
          border: '1px solid',
          borderColor: 'divider',
          textAlign: 'center'
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
          Ready to Put Your Knowledge into Practice?
        </Typography>

        <Typography variant="body1" color="text.secondary" sx={{ mb: 3, maxWidth: 600, mx: 'auto' }}>
          Use our free Resume Builder to create a professional resume or our Resume Analyzer
          to get instant feedback on your existing resume.
        </Typography>

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
          <Button
            component={Link}
            href="/builder"
            variant="contained"
            size="large"
            sx={{
              px: 4,
              py: 1.5,
              fontWeight: 600,
              background: 'linear-gradient(135deg, #C87E42 0%, #E4B784 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #A66835 0%, #C87E42 100%)',
                transform: 'translateY(-2px)',
                boxShadow: 3
              }
            }}
          >
            Resume Builder
          </Button>

          <Button
            component={Link}
            href="/analyzer"
            variant="outlined"
            size="large"
            sx={{
              px: 4,
              py: 1.5,
              fontWeight: 600,
              borderWidth: 2,
              '&:hover': {
                borderWidth: 2,
                bgcolor: 'rgba(200, 126, 66, 0.1)',
                transform: 'translateY(-2px)'
              }
            }}
          >
            Resume Analyzer
          </Button>
        </Stack>
      </Box>
    </Box>
  );
}
