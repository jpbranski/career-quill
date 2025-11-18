// Strongly typed resume data model

export interface ContactInfo {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedin?: string;
  website?: string;
  github?: string;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  bullets: string[];
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  location: string;
  startDate: string;
  endDate: string;
  gpa?: string;
  honors?: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  link?: string;
  bullets: string[];
}

export interface ResumeSection {
  id: string;
  type: 'contact' | 'summary' | 'skills' | 'experience' | 'education' | 'projects' | 'other';
  title: string;
  visible: boolean;
  order: number;
}

export interface Resume {
  id: string;
  contact: ContactInfo;
  summary: string;
  skills: string[];
  experience: Experience[];
  education: Education[];
  projects: Project[];
  sections: ResumeSection[];
  template: 'clean' | 'modern' | 'compact' | 'creative' | 'academic' | 'technical';
  lastModified: string;
}

// Default empty resume
export const createEmptyResume = (): Resume => {
  return {
    id: generateId(),
    contact: {
      fullName: '',
      email: '',
      phone: '',
      location: '',
      linkedin: '',
      website: '',
      github: '',
    },
    summary: '',
    skills: [],
    experience: [],
    education: [],
    projects: [],
    sections: [
      { id: 's1', type: 'contact', title: 'Contact', visible: true, order: 0 },
      { id: 's2', type: 'summary', title: 'Professional Summary', visible: true, order: 1 },
      { id: 's3', type: 'skills', title: 'Skills', visible: true, order: 2 },
      { id: 's4', type: 'experience', title: 'Experience', visible: true, order: 3 },
      { id: 's5', type: 'education', title: 'Education', visible: true, order: 4 },
      { id: 's6', type: 'projects', title: 'Projects', visible: true, order: 5 },
    ],
    template: 'clean',
    lastModified: new Date().toISOString(),
  };
};

// Sample resume for demonstration
export const createSampleResume = (): Resume => {
  return {
    id: generateId(),
    contact: {
      fullName: 'Alex Johnson',
      email: 'alex.johnson@email.com',
      phone: '(555) 123-4567',
      location: 'San Francisco, CA',
      linkedin: 'linkedin.com/in/alexjohnson',
      website: 'alexjohnson.dev',
      github: 'github.com/alexj',
    },
    summary: 'Results-driven software engineer with 5+ years of experience building scalable web applications. Passionate about clean code, user experience, and collaborative development.',
    skills: [
      'JavaScript',
      'TypeScript',
      'React',
      'Next.js',
      'Node.js',
      'Python',
      'AWS',
      'Docker',
      'PostgreSQL',
      'GraphQL',
      'Git',
      'CI/CD',
    ],
    experience: [
      {
        id: generateId(),
        company: 'Tech Innovations Inc.',
        position: 'Senior Software Engineer',
        location: 'San Francisco, CA',
        startDate: '2021-06',
        endDate: '',
        current: true,
        bullets: [
          'Led development of microservices architecture serving 2M+ daily active users, improving system reliability by 40%',
          'Architected and implemented real-time notification system using WebSockets, reducing latency by 60%',
          'Mentored team of 4 junior engineers, establishing code review standards and best practices',
          'Reduced page load times by 35% through optimization of React components and lazy loading strategies',
        ],
      },
      {
        id: generateId(),
        company: 'StartupCo',
        position: 'Full Stack Developer',
        location: 'Remote',
        startDate: '2019-03',
        endDate: '2021-05',
        current: false,
        bullets: [
          'Built customer-facing dashboard using React and Node.js, handling 100K+ monthly users',
          'Implemented CI/CD pipeline with GitHub Actions, reducing deployment time by 70%',
          'Designed and developed RESTful APIs with comprehensive documentation using OpenAPI',
          'Collaborated with design team to create responsive, accessible UI components',
        ],
      },
    ],
    education: [
      {
        id: generateId(),
        institution: 'University of California, Berkeley',
        degree: 'Bachelor of Science',
        field: 'Computer Science',
        location: 'Berkeley, CA',
        startDate: '2015-09',
        endDate: '2019-05',
        gpa: '3.7',
        honors: 'Magna Cum Laude',
      },
    ],
    projects: [
      {
        id: generateId(),
        name: 'Open Source Contributor',
        description: 'Active contributor to various open source projects',
        technologies: ['React', 'TypeScript', 'Testing Library'],
        link: 'github.com/alexj',
        bullets: [
          'Contributed 15+ pull requests to React ecosystem libraries',
          'Maintained TypeScript type definitions for popular npm packages',
        ],
      },
    ],
    sections: [
      { id: 's1', type: 'contact', title: 'Contact', visible: true, order: 0 },
      { id: 's2', type: 'summary', title: 'Professional Summary', visible: true, order: 1 },
      { id: 's3', type: 'skills', title: 'Technical Skills', visible: true, order: 2 },
      { id: 's4', type: 'experience', title: 'Professional Experience', visible: true, order: 3 },
      { id: 's5', type: 'education', title: 'Education', visible: true, order: 4 },
      { id: 's6', type: 'projects', title: 'Projects & Contributions', visible: true, order: 5 },
    ],
    template: 'clean',
    lastModified: new Date().toISOString(),
  };
};

// Helper function to generate unique IDs
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Validation helpers
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePhone(phone: string): boolean {
  const phoneRegex = /^[\d\s\-\(\)\+]+$/;
  return phone.length === 0 || phoneRegex.test(phone);
}

export function validateUrl(url: string): boolean {
  if (!url) return true;
  try {
    // Allow URLs without protocol
    const urlToTest = url.startsWith('http') ? url : `https://${url}`;
    new URL(urlToTest);
    return true;
  } catch {
    return false;
  }
}
