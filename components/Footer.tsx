export default function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="text-center text-gray-600 dark:text-gray-400">
          <p>© {new Date().getFullYear()} Career Quill. All rights reserved.</p>
          <p className="text-sm mt-2">
            Powered by GPT-4o-mini • Secured by reCAPTCHA v3
          </p>
        </div>
      </div>
    </footer>
  );
}
