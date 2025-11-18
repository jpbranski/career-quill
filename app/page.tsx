import Link from 'next/link';

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">
          Career Quill
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
          AI-Powered Resume Analysis & Enhancement
        </p>
        <p className="text-lg text-gray-500 dark:text-gray-400 mb-12 max-w-2xl mx-auto">
          Get expert AI feedback on your resume. Our advanced GPT-powered analyzer
          provides actionable insights to improve clarity, structure, and impact.
        </p>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <div className="text-4xl mb-4">📄</div>
            <h3 className="text-xl font-semibold mb-2">Upload Resume</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Support for PDF, DOCX, or plain text formats
            </p>
          </div>

          <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <div className="text-4xl mb-4">🤖</div>
            <h3 className="text-xl font-semibold mb-2">AI Analysis</h3>
            <p className="text-gray-600 dark:text-gray-400">
              GPT-powered critique with specific improvement suggestions
            </p>
          </div>

          <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <div className="text-4xl mb-4">✨</div>
            <h3 className="text-xl font-semibold mb-2">Get Results</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Receive actionable feedback and a rewritten summary
            </p>
          </div>
        </div>

        <Link
          href="/analyzer"
          className="inline-block px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg shadow-lg transition-colors duration-200"
        >
          Analyze Your Resume Now
        </Link>

        <div className="mt-12 p-6 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <h3 className="text-lg font-semibold mb-3">Features:</h3>
          <ul className="text-left max-w-md mx-auto space-y-2 text-gray-700 dark:text-gray-300">
            <li>✓ Secure server-side AI processing</li>
            <li>✓ Rate limiting for fair usage (5 analyses per day)</li>
            <li>✓ reCAPTCHA verification for security</li>
            <li>✓ Detailed critique and suggestions</li>
            <li>✓ Professional summary rewrite</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
