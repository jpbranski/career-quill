import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import DocsLayout from '@/components/docs/DocsLayout';
import ArticleContent from '@/components/docs/ArticleContent';
import { getArticle, getCategoryById, getAllArticles } from '@/lib/docsConfig';
import { getArticleContent } from '@/lib/articleContent';

interface PageProps {
  params: Promise<{
    category: string;
    slug: string;
  }>;
}

// Generate static params for all articles
export async function generateStaticParams() {
  const allArticles = getAllArticles();
  return allArticles.map((article) => ({
    category: article.category,
    slug: article.slug
  }));
}

// Generate metadata for each article
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category, slug } = await params;
  const article = getArticle(category, slug);
  const categoryData = getCategoryById(category);

  if (!article || !categoryData) {
    return {
      title: 'Article Not Found - Career Quill'
    };
  }

  return {
    title: `${article.title} - ${categoryData.name} - Career Quill`,
    description: article.description,
    keywords: article.keywords,
    openGraph: {
      title: article.title,
      description: article.description,
      type: 'article'
    }
  };
}

export default async function ArticlePage({ params }: PageProps) {
  const { category, slug } = await params;
  const article = getArticle(category, slug);
  const categoryData = getCategoryById(category);

  if (!article || !categoryData) {
    notFound();
  }

  // Get article content
  const content = getArticleContent(category, slug);

  if (!content) {
    notFound();
  }

  // Calculate reading time (rough estimate: 200 words per minute)
  const wordCount = content.split(/\s+/).length;
  const readingTime = Math.ceil(wordCount / 200);

  return (
    <DocsLayout currentCategory={category} currentSlug={slug}>
      <ArticleContent
        title={article.title}
        description={article.description}
        keywords={article.keywords}
        readingTime={readingTime}
        lastUpdated="January 2025"
      >
        <div dangerouslySetInnerHTML={{ __html: content }} />
      </ArticleContent>
    </DocsLayout>
  );
}
