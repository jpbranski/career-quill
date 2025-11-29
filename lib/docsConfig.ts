export interface ExternalLink {
  title: string;
  url: string;
  description: string;
}

export interface Article {
  category: string;
  slug: string;
  title: string;
  description: string;
  keywords: string[];
  order: number;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  order: number;
  externalLinks: ExternalLink[];
}

export const categories: Category[] = [
  {
    id: 'resume-writing',
    name: 'Resume Writing',
    description: 'Master the art of crafting compelling resumes that get noticed by recruiters and pass ATS systems.',
    order: 1,
    externalLinks: [
      {
        title: 'Bureau of Labor Statistics - Occupational Outlook',
        url: 'https://www.bls.gov/ooh/',
        description: 'Official government resource for career information and job market trends'
      },
      {
        title: 'O*NET Online - Occupation Database',
        url: 'https://www.onetonline.org/',
        description: 'Comprehensive database of occupational information and skills requirements'
      }
    ]
  },
  {
    id: 'job-applications',
    name: 'Job Applications',
    description: 'Develop a strategic approach to job applications that maximizes your chances of landing interviews.',
    order: 2,
    externalLinks: [
      {
        title: 'LinkedIn Career Advice',
        url: 'https://www.linkedin.com/learning/topics/career-development',
        description: 'Professional development resources and career guidance'
      },
      {
        title: 'Glassdoor Company Reviews',
        url: 'https://www.glassdoor.com/',
        description: 'Research companies, salaries, and interview experiences'
      }
    ]
  },
  {
    id: 'interviews',
    name: 'Interviews',
    description: 'Prepare for interviews with proven techniques, example answers, and confidence-building strategies.',
    order: 3,
    externalLinks: [
      {
        title: 'The Muse - Interview Preparation',
        url: 'https://www.themuse.com/advice/interview-preparation',
        description: 'Expert advice on interview preparation and techniques'
      },
      {
        title: 'Harvard Business Review - Career Development',
        url: 'https://hbr.org/topic/career-development',
        description: 'Professional insights on career growth and interview strategies'
      }
    ]
  },
  {
    id: 'templates-formatting',
    name: 'Resume Templates & Formatting',
    description: 'Learn the technical aspects of resume design, from fonts and colors to file formats and visual hierarchy.',
    order: 4,
    externalLinks: [
      {
        title: 'Google Fonts',
        url: 'https://fonts.google.com/',
        description: 'Free, professionally designed fonts suitable for resumes'
      },
      {
        title: 'Canva Design School',
        url: 'https://www.canva.com/learn/design/',
        description: 'Visual design principles and best practices'
      }
    ]
  }
];

export const articles: Article[] = [
  // Resume Writing Category
  {
    category: 'resume-writing',
    slug: 'rewrite-resume-2025',
    title: 'How to Rewrite Your Resume for 2025',
    description: 'A comprehensive guide on modern resume standards, emerging trends, and what employers expect in 2025.',
    keywords: ['resume writing', '2025 trends', 'modern resume', 'resume update', 'career development'],
    order: 1
  },
  {
    category: 'resume-writing',
    slug: 'section-by-section-breakdown',
    title: 'Section-by-Section Resume Breakdown',
    description: 'Detailed analysis of every resume section with examples, best practices, and common mistakes to avoid.',
    keywords: ['resume sections', 'resume structure', 'resume format', 'resume components'],
    order: 2
  },
  {
    category: 'resume-writing',
    slug: 'powerful-action-verbs',
    title: '30 Powerful Resume Action Verbs and When to Use Them',
    description: 'Transform weak bullet points into compelling achievements with the right action verbs for every situation.',
    keywords: ['action verbs', 'resume language', 'power words', 'resume writing tips'],
    order: 3
  },
  {
    category: 'resume-writing',
    slug: 'ats-optimization-guide',
    title: 'How ATS Systems Work (and How to Optimize for Them)',
    description: 'Understand applicant tracking systems and learn how to format your resume to pass automated screening.',
    keywords: ['ATS', 'applicant tracking system', 'ATS optimization', 'resume parsing', 'keyword optimization'],
    order: 4
  },
  {
    category: 'resume-writing',
    slug: 'common-resume-mistakes',
    title: 'Common Resume Mistakes That Hurt Your Chances',
    description: 'Identify and eliminate the most frequent resume errors that cause recruiters to reject applications.',
    keywords: ['resume mistakes', 'resume errors', 'what not to do', 'resume tips', 'application red flags'],
    order: 5
  },

  // Job Applications Category
  {
    category: 'job-applications',
    slug: 'tailor-resume-job-description',
    title: 'How to Tailor a Resume to a Job Description',
    description: 'Master the art of customizing your resume to match specific job requirements and increase interview callbacks.',
    keywords: ['tailored resume', 'job description', 'keyword matching', 'application strategy', 'resume customization'],
    order: 1
  },
  {
    category: 'job-applications',
    slug: 'how-many-jobs-to-apply',
    title: 'How Many Jobs You Should Apply To (And Why)',
    description: 'Data-driven insights on application volume, quality vs quantity, and realistic job search expectations.',
    keywords: ['job search', 'application strategy', 'job search statistics', 'application volume'],
    order: 2
  },
  {
    category: 'job-applications',
    slug: 'application-strategy',
    title: 'Building an Application Strategy',
    description: 'Create a systematic approach to job searching with tracking, follow-ups, and optimization techniques.',
    keywords: ['job search strategy', 'application tracking', 'job search organization', 'career planning'],
    order: 3
  },
  {
    category: 'job-applications',
    slug: 'understanding-job-descriptions',
    title: 'Understanding Job Descriptions: Red Flags, Fit Signals, and Seniority Levels',
    description: 'Decode job postings to identify must-have vs nice-to-have requirements and spot potential issues.',
    keywords: ['job description', 'job requirements', 'red flags', 'seniority levels', 'job posting analysis'],
    order: 4
  },

  // Interviews Category
  {
    category: 'interviews',
    slug: 'star-method-examples',
    title: 'The STAR Method with Real Examples',
    description: 'Learn to structure compelling interview answers using Situation, Task, Action, Result framework with proven examples.',
    keywords: ['STAR method', 'behavioral interview', 'interview answers', 'interview technique', 'interview preparation'],
    order: 1
  },
  {
    category: 'interviews',
    slug: 'behavioral-vs-technical-interviews',
    title: 'Behavioral vs Technical Interviews',
    description: 'Understand the differences between interview types and how to prepare for each effectively.',
    keywords: ['behavioral interview', 'technical interview', 'interview types', 'interview preparation'],
    order: 2
  },
  {
    category: 'interviews',
    slug: 'questions-for-interviewer',
    title: 'Questions to Ask the Interviewer',
    description: 'Stand out with thoughtful questions that demonstrate your interest and help you evaluate the opportunity.',
    keywords: ['interview questions', 'questions to ask', 'interviewing the company', 'interview preparation'],
    order: 3
  },
  {
    category: 'interviews',
    slug: 'professional-portfolio-guide',
    title: 'How to Build a Professional Portfolio',
    description: 'Create a compelling portfolio that showcases your work and strengthens your candidacy.',
    keywords: ['portfolio', 'professional portfolio', 'work samples', 'career portfolio', 'portfolio website'],
    order: 4
  },
  {
    category: 'interviews',
    slug: 'career-gaps-layoffs-pivots',
    title: 'How to Talk About Gaps, Layoffs, and Career Pivots',
    description: 'Navigate sensitive topics with confidence using proven strategies for explaining employment gaps and transitions.',
    keywords: ['career gap', 'layoff', 'career change', 'career pivot', 'employment gap', 'interview challenges'],
    order: 5
  },

  // Resume Templates & Formatting Category
  {
    category: 'templates-formatting',
    slug: 'modern-vs-ats-templates',
    title: 'Modern Template vs ATS-Friendly Template',
    description: 'Compare creative and traditional resume formats to choose the right style for your industry and goals.',
    keywords: ['resume template', 'ATS friendly', 'modern resume', 'resume design', 'template selection'],
    order: 1
  },
  {
    category: 'templates-formatting',
    slug: 'font-pairings-sizing',
    title: 'Best Font Pairings & Sizing for Resumes',
    description: 'Professional typography guidance for creating readable, attractive resumes that work in any context.',
    keywords: ['resume fonts', 'typography', 'font pairing', 'font size', 'resume design'],
    order: 2
  },
  {
    category: 'templates-formatting',
    slug: 'pdf-vs-word-formats',
    title: 'Formatting PDFs vs Word Docs',
    description: 'Understand when to use each file format and how to ensure compatibility across systems.',
    keywords: ['PDF resume', 'Word resume', 'file format', 'resume formatting', 'document format'],
    order: 3
  },
  {
    category: 'templates-formatting',
    slug: 'color-spacing-hierarchy',
    title: 'Color, Spacing, and Visual Hierarchy for Professional Documents',
    description: 'Master design principles that make your resume visually appealing while maintaining professionalism.',
    keywords: ['visual hierarchy', 'resume design', 'color theory', 'spacing', 'design principles'],
    order: 4
  }
];

export function getArticlesByCategory(categoryId: string): Article[] {
  return articles
    .filter(article => article.category === categoryId)
    .sort((a, b) => a.order - b.order);
}

export function getArticle(categoryId: string, slug: string): Article | undefined {
  return articles.find(
    article => article.category === categoryId && article.slug === slug
  );
}

export function getCategoryById(categoryId: string): Category | undefined {
  return categories.find(cat => cat.id === categoryId);
}

export function getAllArticles(): Article[] {
  return articles.sort((a, b) => {
    const categoryA = getCategoryById(a.category);
    const categoryB = getCategoryById(b.category);
    if (categoryA?.order !== categoryB?.order) {
      return (categoryA?.order || 0) - (categoryB?.order || 0);
    }
    return a.order - b.order;
  });
}
