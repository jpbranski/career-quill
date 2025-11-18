# Career Quill

**AI-Powered Resume Analyzer** - Get expert feedback on your resume using GPT-4o-mini with secure rate limiting and reCAPTCHA verification.

## Features

- 🤖 **GPT-4o-mini Integration** - Advanced AI analysis for resume critique and improvement
- 🔒 **Secure API Key Handling** - Server-side only, never exposed to the client
- 🛡️ **reCAPTCHA v3 Verification** - Protects against bots and abuse
- ⏱️ **Dual Rate Limiting** - Both client-side and server-side enforcement
- 📄 **Multiple File Formats** - Support for PDF, DOCX, and plain text
- ✨ **Comprehensive Feedback** - Critique, suggestions, and rewritten summary
- 🎨 **Modern UI** - Built with Next.js 15, React 19, and Tailwind CSS

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Runtime**: React 19
- **Styling**: Tailwind CSS
- **AI**: OpenAI GPT-4o-mini
- **Security**: Google reCAPTCHA v3
- **Language**: TypeScript
- **File Processing**: mammoth (DOCX), pdf-parse (PDF)

## Prerequisites

Before you begin, ensure you have:

- Node.js 18.17 or later
- npm, yarn, or pnpm package manager
- An OpenAI API key ([Get one here](https://platform.openai.com/api-keys))
- Google reCAPTCHA v3 credentials ([Register here](https://www.google.com/recaptcha/admin))

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/jpbranski/career-quill.git
cd career-quill
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```bash
# OpenAI Configuration
OPENAI_API_KEY="sk-proj-..."              # Your OpenAI API key (REQUIRED)
AI_MODEL="gpt-4o-mini"                     # Model to use (default: gpt-4o-mini)

# Google reCAPTCHA v3 Configuration
RECAPTCHA_SECRET_KEY="6Lf..."              # Your reCAPTCHA secret key (REQUIRED)
NEXT_PUBLIC_RECAPTCHA_SITE_KEY="6Lf..."   # Your reCAPTCHA site key (REQUIRED)

# Rate Limiting Configuration
RATE_LIMIT_MAX_PER_DAY="5"                 # Max analyses per IP per day (default: 5)
RATE_LIMIT_COOLDOWN_SECONDS="30"          # Cooldown between requests (default: 30)
```

**Important Security Notes:**

- ⚠️ **NEVER commit `.env.local` to version control** - It's already in `.gitignore`
- ⚠️ **NEVER expose `OPENAI_API_KEY` or `RECAPTCHA_SECRET_KEY` to the client**
- ✅ Only `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` should be exposed (it's prefixed with `NEXT_PUBLIC_`)

### 4. Set Up OpenAI API Key

1. Go to [OpenAI Platform](https://platform.openai.com/api-keys)
2. Create a new API key
3. Copy the key and paste it into your `.env.local` as `OPENAI_API_KEY`
4. Ensure you have credits/billing set up in your OpenAI account

### 5. Set Up Google reCAPTCHA v3

1. Go to [Google reCAPTCHA Admin](https://www.google.com/recaptcha/admin)
2. Click "Create" or "+" to register a new site
3. Choose **reCAPTCHA v3**
4. Add your domain(s):
   - For local development: `localhost`
   - For production: your actual domain (e.g., `career-quill.vercel.app`)
5. Copy the **Site Key** to `NEXT_PUBLIC_RECAPTCHA_SITE_KEY`
6. Copy the **Secret Key** to `RECAPTCHA_SECRET_KEY`

### 6. Run the Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
career-quill/
├── app/
│   ├── analyzer/
│   │   └── page.tsx          # Resume analyzer page with reCAPTCHA & rate limiting
│   ├── api/
│   │   └── analyze-resume/
│   │       └── route.ts      # API endpoint for GPT analysis
│   ├── layout.tsx            # Root layout with reCAPTCHA script
│   ├── page.tsx              # Home page
│   └── globals.css           # Global styles with Tailwind
├── components/
│   ├── Header.tsx            # Navigation header
│   └── Footer.tsx            # Site footer
├── lib/
│   ├── rateLimiter.ts        # Server-side rate limiting utility
│   └── getClientIp.ts        # IP extraction utility
├── .env.example              # Environment variable template
├── .env.local                # Your actual environment variables (DO NOT COMMIT)
├── next.config.ts            # Next.js configuration
├── tailwind.config.ts        # Tailwind CSS configuration
├── tsconfig.json             # TypeScript configuration
└── package.json              # Project dependencies
```

## How It Works

### Client-Side Flow

1. **User uploads or pastes resume text** - Supports PDF, DOCX, or plain text
2. **Client-side validation** - Checks minimum length and format
3. **Rate limit check** - Verifies cooldown and daily limit via localStorage
4. **reCAPTCHA execution** - Generates token with action `resume_ai_critique`
5. **API request** - Sends resume text + reCAPTCHA token to `/api/analyze-resume`
6. **Display results** - Shows critique, suggestions, and rewritten summary

### Server-Side Flow

1. **Validate input** - Checks resume text and reCAPTCHA token presence
2. **Verify reCAPTCHA** - Validates token with Google (score ≥ 0.5 required)
3. **Rate limit enforcement** - IP-based cooldown and daily limit check
4. **OpenAI request** - Sends structured prompt to GPT-4o-mini
5. **Parse response** - Extracts critique, suggestions, and rewritten summary
6. **Return JSON** - Sends analysis back to client

## Rate Limiting

Career Quill implements **dual rate limiting** for security and fair usage:

### Client-Side (localStorage)

- **Cooldown**: 30 seconds between requests (configurable)
- **Daily Limit**: 5 analyses per day per browser (configurable)
- **Reset**: Automatically resets at midnight local time

### Server-Side (in-memory)

- **Cooldown**: 30 seconds between requests per IP (configurable)
- **Daily Limit**: 5 analyses per day per IP (configurable)
- **Reset**: Automatically resets 24 hours after first request

**Note**: Server-side rate limiting uses an in-memory store that resets on server restart. For production at scale, consider using Redis or a similar persistent store.

## API Endpoints

### POST `/api/analyze-resume`

Analyzes resume text using GPT-4o-mini.

**Request Body:**
```json
{
  "resumeText": "string (min 50 chars)",
  "recaptchaToken": "string"
}
```

**Response (Success):**
```json
{
  "success": true,
  "analysis": {
    "summary": "2-3 paragraph critique...",
    "suggestions": ["suggestion 1", "suggestion 2", ...],
    "rewrittenSummary": "Professional summary..."
  }
}
```

**Response (Error):**
```json
{
  "error": "Error message",
  "retryAfter": 30  // Optional: seconds until retry allowed
}
```

**Status Codes:**
- `200` - Success
- `400` - Invalid input
- `403` - reCAPTCHA verification failed
- `429` - Rate limit exceeded
- `500` - Server error

## Deployment

### Deploying to Vercel

1. Push your code to GitHub
2. Import the repository in [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard:
   - `OPENAI_API_KEY`
   - `AI_MODEL`
   - `RECAPTCHA_SECRET_KEY`
   - `NEXT_PUBLIC_RECAPTCHA_SITE_KEY`
   - `RATE_LIMIT_MAX_PER_DAY`
   - `RATE_LIMIT_COOLDOWN_SECONDS`
4. Update reCAPTCHA settings to include your Vercel domain
5. Deploy!

### Environment Variables for Production

Make sure to set all environment variables in your deployment platform (Vercel, Netlify, etc.). Never commit `.env.local` to version control.

## Security Best Practices

✅ **DO:**
- Keep `OPENAI_API_KEY` and `RECAPTCHA_SECRET_KEY` server-side only
- Use `NEXT_PUBLIC_` prefix only for variables that MUST be client-side
- Regularly rotate your API keys
- Monitor OpenAI usage and set spending limits
- Use environment variables for all sensitive configuration

❌ **DON'T:**
- Commit `.env.local` to version control
- Expose secret keys in client-side code
- Skip reCAPTCHA verification
- Disable rate limiting in production
- Share your API keys publicly

## Troubleshooting

### reCAPTCHA not loading
- Check that `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` is correctly set
- Verify the site key is valid and matches the domain
- Check browser console for errors

### OpenAI API errors
- Verify `OPENAI_API_KEY` is correct and active
- Ensure you have credits/billing set up
- Check OpenAI status page for outages
- Review API usage limits

### Rate limiting issues
- Client-side limits are stored in localStorage (can be cleared manually)
- Server-side limits reset on server restart (in-memory store)
- Check environment variables for custom limits

### File upload errors
- Ensure file is PDF, DOCX, or TXT format
- Check file is not corrupted
- Try pasting text directly if upload fails

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.

## Support

For issues, questions, or suggestions, please [open an issue](https://github.com/jpbranski/career-quill/issues) on GitHub.

---

Built with ❤️ using Next.js, OpenAI, and Tailwind CSS
