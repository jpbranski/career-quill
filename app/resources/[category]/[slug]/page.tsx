import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import DocsLayout from '@/components/docs/DocsLayout';
import ArticleContent from '@/components/docs/ArticleContent';
import { getArticle, getCategoryById, getAllArticles } from '@/lib/docsConfig';
import { getArticleContent } from '@/lib/articleContent';

interface PageProps {
  params: {
    category: string;
    slug: string;
  };
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
  const article = getArticle(params.category, params.slug);
  const category = getCategoryById(params.category);

  if (!article || !category) {
    return {
      title: 'Article Not Found - Career Quill'
    };
  }

  return {
    title: `${article.title} - ${category.name} - Career Quill`,
    description: article.description,
    keywords: article.keywords,
    openGraph: {
      title: article.title,
      description: article.description,
      type: 'article'
    }
  };
}

export default function ArticlePage({ params }: PageProps) {
  const article = getArticle(params.category, params.slug);
  const category = getCategoryById(params.category);

  if (!article || !category) {
    notFound();
  }

  // Get article content
  const content = getArticleContent(params.category, params.slug);

  if (!content) {
    notFound();
  }

  // Calculate reading time (rough estimate: 200 words per minute)
  const wordCount = content.split(/\s+/).length;
  const readingTime = Math.ceil(wordCount / 200);

  return (
    <DocsLayout currentCategory={params.category} currentSlug={params.slug}>
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
