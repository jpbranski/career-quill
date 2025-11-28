'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Box,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Collapse,
  Divider,
  InputAdornment,
  Stack,
  Chip
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { categories, articles, type Category, type Article } from '@/lib/docsConfig';

interface DocsSidebarProps {
  currentCategory?: string;
  currentSlug?: string;
}

export default function DocsSidebar({ currentCategory, currentSlug }: DocsSidebarProps) {
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>(() => {
    // Auto-expand the current category
    const initial: Record<string, boolean> = {};
    if (currentCategory) {
      initial[currentCategory] = true;
    }
    return initial;
  });

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  // Filter articles based on search and category filter
  const filteredContent = useMemo(() => {
    let filtered = articles;

    // Apply category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(article => article.category === categoryFilter);
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(article =>
        article.title.toLowerCase().includes(query) ||
        article.description.toLowerCase().includes(query) ||
        article.keywords.some(keyword => keyword.toLowerCase().includes(query))
      );
    }

    return filtered;
  }, [searchQuery, categoryFilter]);

  // Group filtered articles by category
  const groupedArticles = useMemo(() => {
    const groups: Record<string, Article[]> = {};
    filteredContent.forEach(article => {
      if (!groups[article.category]) {
        groups[article.category] = [];
      }
      groups[article.category].push(article);
    });
    return groups;
  }, [filteredContent]);

  // Get categories to display (sorted by order)
  const displayCategories = useMemo(() => {
    return categories
      .filter(cat => groupedArticles[cat.id] && groupedArticles[cat.id].length > 0)
      .sort((a, b) => a.order - b.order);
  }, [groupedArticles]);

  const isArticleActive = (article: Article) => {
    return article.category === currentCategory && article.slug === currentSlug;
  };

  return (
    <Box
      sx={{
        width: '280px',
        height: '100vh',
        position: 'sticky',
        top: 0,
        overflowY: 'auto',
        borderRight: '1px solid',
        borderColor: 'divider',
        bgcolor: 'background.paper',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {/* Header */}
      <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
          Resources
        </Typography>

        {/* Search Bar */}
        <TextField
          fullWidth
          size="small"
          placeholder="Search articles..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            )
          }}
          sx={{ mb: 2 }}
        />

        {/* Category Filter */}
        <FormControl fullWidth size="small">
          <InputLabel>Filter by Category</InputLabel>
          <Select
            value={categoryFilter}
            label="Filter by Category"
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <MenuItem value="all">All Categories</MenuItem>
            {categories.map(cat => (
              <MenuItem key={cat.id} value={cat.id}>
                {cat.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Navigation */}
      <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
        {displayCategories.length === 0 ? (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              No articles found
            </Typography>
          </Box>
        ) : (
          <List disablePadding>
            {displayCategories.map((category) => {
              const isExpanded = expandedCategories[category.id] ?? false;
              const categoryArticles = groupedArticles[category.id] || [];

              return (
                <Box key={category.id}>
                  {/* Category Header */}
                  <ListItem disablePadding>
                    <ListItemButton
                      onClick={() => toggleCategory(category.id)}
                      sx={{
                        py: 1.5,
                        px: 2,
                        bgcolor: isExpanded ? 'action.selected' : 'transparent',
                        '&:hover': {
                          bgcolor: 'action.hover'
                        }
                      }}
                    >
                      <ListItemText
                        primary={
                          <Typography variant="subtitle2" fontWeight={600}>
                            {category.name}
                          </Typography>
                        }
                      />
                      {isExpanded ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>
                  </ListItem>

                  {/* Category Articles */}
                  <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                    <List disablePadding>
                      {categoryArticles.map((article) => {
                        const isActive = isArticleActive(article);
                        return (
                          <ListItem key={article.slug} disablePadding>
                            <ListItemButton
                              component={Link}
                              href={`/resources/${article.category}/${article.slug}`}
                              selected={isActive}
                              sx={{
                                pl: 4,
                                pr: 2,
                                py: 1,
                                borderLeft: '3px solid',
                                borderColor: isActive ? 'primary.main' : 'transparent',
                                '&.Mui-selected': {
                                  bgcolor: 'action.selected',
                                  '&:hover': {
                                    bgcolor: 'action.selected'
                                  }
                                }
                              }}
                            >
                              <ListItemText
                                primary={
                                  <Typography
                                    variant="body2"
                                    sx={{
                                      fontWeight: isActive ? 600 : 400,
                                      color: isActive ? 'primary.main' : 'text.primary'
                                    }}
                                  >
                                    {article.title}
                                  </Typography>
                                }
                              />
                            </ListItemButton>
                          </ListItem>
                        );
                      })}
                    </List>

                    {/* External Links */}
                    {category.externalLinks && category.externalLinks.length > 0 && (
                      <>
                        <Divider sx={{ my: 1, mx: 2 }} />
                        <Box sx={{ px: 2, py: 1 }}>
                          <Typography variant="caption" color="text.secondary" sx={{ px: 2, display: 'block', mb: 1 }}>
                            External Resources
                          </Typography>
                          <Stack spacing={0.5}>
                            {category.externalLinks.map((link, idx) => (
                              <Link
                                key={idx}
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ textDecoration: 'none' }}
                              >
                                <Box
                                  sx={{
                                    px: 2,
                                    py: 0.75,
                                    borderRadius: 1,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 0.5,
                                    '&:hover': {
                                      bgcolor: 'action.hover'
                                    }
                                  }}
                                >
                                  <Typography
                                    variant="caption"
                                    sx={{
                                      color: 'primary.main',
                                      fontSize: '0.75rem',
                                      flexGrow: 1
                                    }}
                                  >
                                    {link.title}
                                  </Typography>
                                  <OpenInNewIcon sx={{ fontSize: 12, color: 'text.secondary' }} />
                                </Box>
                              </Link>
                            ))}
                          </Stack>
                        </Box>
                      </>
                    )}
                  </Collapse>
                </Box>
              );
            })}
          </List>
        )}
      </Box>

      {/* Results Count */}
      {(searchQuery || categoryFilter !== 'all') && (
        <Box sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider' }}>
          <Chip
            label={`${filteredContent.length} article${filteredContent.length !== 1 ? 's' : ''} found`}
            size="small"
            color="primary"
            variant="outlined"
          />
        </Box>
      )}
    </Box>
  );
}
