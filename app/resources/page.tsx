import { Metadata } from 'next';
import DocsLayout from '@/components/docs/DocsLayout';
import ResourcesOverview from '@/components/docs/ResourcesOverview';

export const metadata: Metadata = {
  title: 'Resources - Career Quill',
  description: 'Comprehensive guides on resume writing, job applications, interviews, and professional formatting.',
  keywords: ['career resources', 'resume writing', 'job search', 'interview tips', 'career development']
};

export default function ResourcesPage() {
  return (
    <DocsLayout>
      <ResourcesOverview />
    </DocsLayout>
  );
}
