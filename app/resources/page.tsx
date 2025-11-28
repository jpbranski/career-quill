import { Metadata } from 'next';
import Link from 'next/link';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActionArea,
  Stack,
  Chip
} from '@mui/material';
import ArticleIcon from '@mui/icons-material/Article';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { categories, getArticlesByCategory } from '@/lib/docsConfig';

export const metadata: Metadata = {
  title: 'Resources - Career Quill',
  description: 'Comprehensive guides on resume writing, job applications, interviews, and professional formatting.',
  keywords: ['career resources', 'resume writing', 'job search', 'interview tips', 'career development']
};

export default function ResourcesPage() {
  return (
    <Box sx={{ minHeight: 'calc(100vh - 64px)', pt: '64px', bgcolor: 'background.default' }}>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, rgba(200, 126, 66, 0.1) 0%, rgba(90, 100, 179, 0.1) 100%)',
          py: { xs: 6, md: 10 },
          borderBottom: '1px solid',
          borderColor: 'divider'
        }}
      >
        <Container maxWidth="lg">
          <Stack spacing={2} alignItems="center" textAlign="center">
            <Typography
              variant="h2"
              component="h1"
              sx={{
                fontWeight: 700,
                fontSize: { xs: '2.5rem', md: '3.5rem' },
                background: 'linear-gradient(135deg, #C87E42 0%, #5A64B3 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
                mb: 2
              }}
            >
              Career Resources Hub
            </Typography>

            <Typography
              variant="h5"
              sx={{
                color: 'text.secondary',
                maxWidth: '800px',
                fontSize: { xs: '1.125rem', md: '1.5rem' },
                lineHeight: 1.6
              }}
            >
              Master every step of your career journey with comprehensive guides,
              actionable strategies, and expert insights.
            </Typography>

            <Stack direction="row" spacing={2} flexWrap="wrap" sx={{ mt: 3, justifyContent: 'center' }}>
              <Chip
                label={`${categories.reduce((acc, cat) => acc + getArticlesByCategory(cat.id).length, 0)} Articles`}
                color="primary"
                sx={{ fontWeight: 600 }}
              />
              <Chip
                label={`${categories.length} Categories`}
                variant="outlined"
                sx={{ fontWeight: 600 }}
              />
            </Stack>
          </Stack>
        </Container>
      </Box>

      {/* Categories Grid */}
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
        <Grid container spacing={4}>
          {categories
            .sort((a, b) => a.order - b.order)
            .map((category) => {
              const categoryArticles = getArticlesByCategory(category.id);
              const firstArticle = categoryArticles[0];

              return (
                <Grid item xs={12} md={6} key={category.id}>
                  <Card
                    elevation={0}
                    sx={{
                      height: '100%',
                      border: '1px solid',
                      borderColor: 'divider',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        borderColor: 'primary.main',
                        transform: 'translateY(-4px)',
                        boxShadow: 3
                      }
                    }}
                  >
                    <CardActionArea
                      component={Link}
                      href={firstArticle ? `/resources/${firstArticle.category}/${firstArticle.slug}` : '#'}
                      sx={{ height: '100%' }}
                    >
                      <CardContent sx={{ p: 4, height: '100%', display: 'flex', flexDirection: 'column' }}>
                        {/* Icon */}
                        <Box
                          sx={{
                            width: 56,
                            height: 56,
                            borderRadius: 2,
                            bgcolor: 'primary.main',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            mb: 3
                          }}
                        >
                          <ArticleIcon sx={{ fontSize: 32, color: 'primary.contrastText' }} />
                        </Box>

                        {/* Category Name */}
                        <Typography
                          variant="h5"
                          component="h2"
                          sx={{
                            fontWeight: 700,
                            mb: 2
                          }}
                        >
                          {category.name}
                        </Typography>

                        {/* Description */}
                        <Typography
                          variant="body1"
                          color="text.secondary"
                          sx={{
                            mb: 3,
                            lineHeight: 1.7,
                            flexGrow: 1
                          }}
                        >
                          {category.description}
                        </Typography>

                        {/* Article Count */}
                        <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
                          <Chip
                            label={`${categoryArticles.length} article${categoryArticles.length !== 1 ? 's' : ''}`}
                            size="small"
                            variant="outlined"
                          />
                          <Stack direction="row" spacing={0.5} alignItems="center" sx={{ color: 'primary.main' }}>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              Explore
                            </Typography>
                            <ArrowForwardIcon fontSize="small" />
                          </Stack>
                        </Stack>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Grid>
              );
            })}
        </Grid>

        {/* Additional CTA */}
        <Box
          sx={{
            mt: 10,
            p: { xs: 4, md: 6 },
            borderRadius: 2,
            background: 'linear-gradient(135deg, rgba(200, 126, 66, 0.1) 0%, rgba(90, 100, 179, 0.1) 100%)',
            border: '1px solid',
            borderColor: 'divider',
            textAlign: 'center'
          }}
        >
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
            Ready to Build Your Resume?
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3, maxWidth: 600, mx: 'auto' }}>
            Put what you've learned into practice with our free resume builder and analyzer tools.
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
            <Link href="/builder" style={{ textDecoration: 'none' }}>
              <Box
                component="button"
                sx={{
                  px: 4,
                  py: 1.5,
                  borderRadius: 1,
                  bgcolor: 'primary.main',
                  color: 'primary.contrastText',
                  fontWeight: 600,
                  fontSize: '1rem',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  '&:hover': {
                    bgcolor: 'primary.dark',
                    transform: 'translateY(-2px)',
                    boxShadow: 2
                  }
                }}
              >
                Resume Builder
              </Box>
            </Link>
            <Link href="/analyzer" style={{ textDecoration: 'none' }}>
              <Box
                component="button"
                sx={{
                  px: 4,
                  py: 1.5,
                  borderRadius: 1,
                  bgcolor: 'transparent',
                  color: 'primary.main',
                  fontWeight: 600,
                  fontSize: '1rem',
                  border: '2px solid',
                  borderColor: 'primary.main',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  '&:hover': {
                    bgcolor: 'primary.main',
                    color: 'primary.contrastText',
                    transform: 'translateY(-2px)',
                    boxShadow: 2
                  }
                }}
              >
                Resume Analyzer
              </Box>
            </Link>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
}
