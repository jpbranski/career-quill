# Career Quill 📝

> Build and refine a resume you're proud of

**Career Quill** is a production-ready, full-stack Next.js 16 application that helps users create professional resumes with beautiful templates and get AI-powered feedback to make them stand out.

![Next.js](https://img.shields.io/badge/Next.js-16-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue)
![MUI](https://img.shields.io/badge/MUI-6-007FFF)
![License](https://img.shields.io/badge/license-MIT-green)

## ✨ Features

### Resume Builder
- 🎨 **6 Professional Templates**: Clean, Modern, Compact, Creative, Academic, and Technical
- ⚡ **Real-time Preview**: See changes instantly as you edit
- 📄 **Multiple Export Formats**: PDF, DOCX, and TXT
- 💾 **Auto-save**: Your work is automatically saved to localStorage
- 🔄 **Section Reordering**: Customize your resume structure
- 📱 **Fully Responsive**: Works beautifully on all devices

### Resume Analyzer
- 🔍 **Instant Analysis**: Upload PDF/DOCX or paste text for immediate feedback
- 📊 **Comprehensive Metrics**: Word count, reading time, bullet analysis, and more
- 💡 **Smart Suggestions**: Get actionable recommendations for improvement
- 🤖 **AI-Powered Review**: Optional OpenAI integration for detailed critique
- 🎯 **ATS Optimization**: Keyword density and formatting checks
- ⏱️ **Rate Limiting**: Client-side rate limiting (5 requests/day, 30s cooldown)

### Technical Highlights
- ✅ **No Database Required**: All data stored locally
- 🔒 **Privacy First**: Your data never leaves your device (except AI analysis)
- ♿ **WCAG AA Accessible**: Fully keyboard-navigable with proper ARIA labels
- 🌓 **Dark/Light Mode**: Beautiful themes with persistent preference
- 🚀 **Production Ready**: Fully deployable on Vercel
- 📦 **Zero Backend**: Only one API route for AI critique

## 🚀 Quick Start

### Prerequisites
- Node.js 18.17.0 or higher
- npm, yarn, or pnpm

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd career-quill
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```

   Edit `.env` and add your OpenAI API key:
   ```env
   OPENAI_API_KEY=sk-your-openai-api-key-here
   OPENAI_MODEL=gpt-4o-mini
   ```

   > **Note**: The AI review feature is optional. The app works without an API key, but AI analysis will be unavailable.

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
career-quill/
├── app/
│   ├── layout.tsx              # Root layout with theme provider
│   ├── page.tsx                # Landing page
│   ├── globals.css             # Global styles with CSS variables
│   ├── builder/
│   │   └── page.tsx           # Resume builder page
│   ├── analyzer/
│   │   └── page.tsx           # Resume analyzer page
│   └── api/
│       └── analyze-resume/
│           └── route.ts       # AI critique API endpoint
├── components/
│   ├── Header.tsx             # App header with navigation
│   ├── Footer.tsx             # App footer
│   ├── QuillIcon.tsx          # Custom quill logo
│   ├── ThemeToggle.tsx        # Light/dark mode toggle
│   ├── builder/               # Builder editor components
│   │   ├── ContactSection.tsx
│   │   ├── SummarySection.tsx
│   │   ├── SkillsSection.tsx
│   │   ├── ExperienceSection.tsx
│   │   ├── EducationSection.tsx
│   │   ├── ProjectsSection.tsx
│   │   ├── ExportButtons.tsx
│   │   └── SectionReorder.tsx
│   ├── preview/               # Resume template components
│   │   ├── ResumePreview.tsx
│   │   ├── CleanTemplate.tsx
│   │   ├── ModernTemplate.tsx
│   │   ├── CompactTemplate.tsx
│   │   ├── CreativeTemplate.tsx
│   │   ├── AcademicTemplate.tsx
│   │   └── TechnicalTemplate.tsx
│   └── analyzer/              # Analyzer components
│       ├── FileUpload.tsx
│       ├── AnalysisResults.tsx
│       └── SuggestionsSidebar.tsx
├── lib/
│   ├── resumeModel.ts         # TypeScript resume data model
│   ├── resumeStorage.ts       # localStorage utilities
│   ├── analyzer.ts            # Non-AI analysis logic
│   ├── exportUtils.ts         # TXT, PDF, DOCX export
│   └── rateLimit.ts           # Client-side rate limiting
├── theme/
│   └── theme.ts               # MUI theme configuration
├── styles/
│   ├── resume.module.css      # Resume template styles
│   └── analyzer.module.css    # Analyzer page styles
└── public/                    # Static assets
```

## 🎨 Templates

Career Quill includes 6 professionally designed resume templates:

1. **Clean** - Classic one-column layout, perfect for any industry
2. **Modern** - Two-column design with sidebar for contact and skills
3. **Compact** - Space-efficient layout for concise resumes
4. **Creative** - Eye-catching header with gradient accent
5. **Academic** - Traditional format ideal for academic positions
6. **Technical** - Developer-focused with code-style section headers

## 🔧 Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript 5.7
- **UI Library**: Material-UI (MUI) v6
- **Styling**: CSS Modules + CSS Variables (no Tailwind)
- **PDF Generation**: react-to-print
- **DOCX Export**: docx package
- **PDF Parsing**: pdfjs-dist
- **DOCX Parsing**: mammoth.js
- **AI Integration**: OpenAI API (gpt-4o-mini)
- **State Management**: React hooks + localStorage

## 🌐 Deployment

### Deploy to Vercel (Recommended)

1. **Push your code to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will auto-detect Next.js settings

3. **Add Environment Variables**
   - In Vercel project settings, go to "Environment Variables"
   - Add `OPENAI_API_KEY` with your OpenAI API key
   - Optionally add `OPENAI_MODEL` (defaults to gpt-4o-mini)

4. **Deploy**
   - Click "Deploy"
   - Your app will be live at `https://your-project.vercel.app`

### Manual Deployment

```bash
# Build the production version
npm run build

# Start the production server
npm start
```

## 🔐 Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `OPENAI_API_KEY` | Optional | - | OpenAI API key for AI resume review |
| `OPENAI_MODEL` | Optional | `gpt-4o-mini` | OpenAI model to use |

> **Note**: Without `OPENAI_API_KEY`, the app works fully except for the "Run AI Review" feature.

## 📊 Data Storage

- **Resume Data**: Stored in browser's localStorage
- **Theme Preference**: Stored in localStorage
- **Rate Limiting**: Stored in localStorage
- **No Server Database**: Everything is client-side except AI API calls

## ♿ Accessibility

Career Quill is built with accessibility in mind:
- ✅ WCAG AA compliant
- ✅ Full keyboard navigation
- ✅ Proper ARIA labels
- ✅ Visible focus indicators
- ✅ Screen reader friendly
- ✅ Sufficient color contrast

## 🎯 Rate Limiting

AI review requests are rate-limited on the client side:
- **Daily Limit**: 5 requests per day
- **Cooldown**: 30 seconds between requests
- **Storage**: Managed via localStorage
- **Reset**: Automatically resets at midnight

## 🧪 Development

### Available Scripts

```bash
# Development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Type checking
npm run type-check

# Linting
npm run lint
```

### Adding a New Template

1. Create a new component in `components/preview/`
2. Add corresponding styles in `styles/resume.module.css`
3. Register the template in `components/preview/ResumePreview.tsx`
4. Add the option in `app/builder/page.tsx` template selector

## 📝 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest new features
- Submit pull requests
- Improve documentation

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [MUI](https://mui.com/)
- AI powered by [OpenAI](https://openai.com/)
- Icons from [Material Icons](https://mui.com/material-ui/material-icons/)

## 📧 Support

For issues or questions:
- Open a GitHub issue
- Check existing documentation
- Review the code comments

---

**Built with ❤️ by Career Quill Team**

*Empowering job seekers with professional tools*
