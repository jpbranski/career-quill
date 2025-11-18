import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-white dark:bg-gray-900 shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <nav className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-primary-600">
            Career Quill
          </Link>
          <div className="flex gap-6">
            <Link
              href="/"
              className="text-gray-600 dark:text-gray-300 hover:text-primary-600 transition-colors"
            >
              Home
            </Link>
            <Link
              href="/analyzer"
              className="text-gray-600 dark:text-gray-300 hover:text-primary-600 transition-colors"
            >
              Analyzer
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
