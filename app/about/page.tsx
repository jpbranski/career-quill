import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About - Career Quill',
  description: 'Learn about The Career Quill, why it exists, and the philosophy behind building better tools for modern career development.',
};

export default function AboutPage() {
  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Box component="main">
        <Typography
          variant="h1"
          component="h1"
          gutterBottom
          sx={{
            fontSize: { xs: '2rem', md: '2.5rem' },
            fontWeight: 700,
            mb: 4,
          }}
        >
          About The Career Quill
        </Typography>

        <Box component="section" sx={{ mb: 5 }}>
          <Typography variant="body1" paragraph sx={{ fontSize: '1.125rem', lineHeight: 1.7 }}>
            The Career Quill started with a simple observation: the tools we use to tell our professional stories are broken.
          </Typography>
          <Typography variant="body1" paragraph sx={{ fontSize: '1.125rem', lineHeight: 1.7 }}>
            Not broken in an obvious way—they load, they let you type, they export PDFs. But they fail at something more fundamental. They don&apos;t help you think. They don&apos;t guide you toward clarity. They give you templates and formatting options when what you really need is a moment of focus to articulate what you&apos;ve actually accomplished and why it matters.
          </Typography>
          <Typography variant="body1" paragraph sx={{ fontSize: '1.125rem', lineHeight: 1.7 }}>
            I built The Career Quill because I&apos;ve been there—staring at a half-finished resume, knowing I had meaningful work to show but struggling to translate it into something that felt both honest and compelling. I&apos;ve felt the weight of trying to package years of growth, learning, and problem-solving into bullet points that somehow need to impress both a human and an algorithm.
          </Typography>
        </Box>

        <Box component="section" sx={{ mb: 5 }}>
          <Typography variant="h2" component="h2" gutterBottom sx={{ fontSize: '1.75rem', fontWeight: 600, mt: 5, mb: 3 }}>
            The Problem: Career Storytelling in a Fragmented World
          </Typography>
          <Typography variant="body1" paragraph sx={{ fontSize: '1.125rem', lineHeight: 1.7 }}>
            Modern job hunting is a strange, contradictory experience. On one hand, we&apos;re told to be authentic, to let our personalities shine, to stand out. On the other hand, we&apos;re filtering ourselves through Applicant Tracking Systems (ATS) that parse our resumes like search engines, reducing our stories to keyword frequencies and formatting compliance.
          </Typography>
          <Typography variant="body1" paragraph sx={{ fontSize: '1.125rem', lineHeight: 1.7 }}>
            Meanwhile, resume templates have become ornate distractions. There&apos;s an entire industry built around selling you the &quot;perfect&quot; resume design—multi-column layouts, color-coded sections, infographic skill bars that look impressive but say nothing. These templates optimize for visual novelty, not for clarity or the realities of how resumes are actually read.
          </Typography>
          <Typography variant="body1" paragraph sx={{ fontSize: '1.125rem', lineHeight: 1.7 }}>
            And underneath it all is imposter syndrome. That quiet voice that says your experience isn&apos;t impressive enough, that you don&apos;t have the right credentials, that everyone else has it figured out and you&apos;re just pretending. So you downplay your achievements, bury your best work in vague language, or copy generic phrases from the internet because surely someone else knows better than you what your career should sound like.
          </Typography>
          <Typography variant="body1" paragraph sx={{ fontSize: '1.125rem', lineHeight: 1.7 }}>
            The result? Fragmented narratives. Resumes that feel like lists of responsibilities rather than stories of growth. Job applications that blend together because everyone is using the same buzzwords and the same advice from the same LinkedIn influencers.
          </Typography>
        </Box>

        <Box component="section" sx={{ mb: 5 }}>
          <Typography variant="h2" component="h2" gutterBottom sx={{ fontSize: '1.75rem', fontWeight: 600, mt: 5, mb: 3 }}>
            The Solution: Writing as Craft, Clarity as Design
          </Typography>
          <Typography variant="body1" paragraph sx={{ fontSize: '1.125rem', lineHeight: 1.7 }}>
            The Career Quill doesn&apos;t try to impress you with features. It doesn&apos;t promise &quot;10x your job applications&quot; or claim to have reverse-engineered some secret hiring formula. Instead, it focuses on something simpler and more important: helping you write clearly about what you&apos;ve done.
          </Typography>
          <Typography variant="body1" paragraph sx={{ fontSize: '1.125rem', lineHeight: 1.7 }}>
            Good writing is good thinking made visible. When you struggle to describe a project or role, it&apos;s often because you haven&apos;t yet clarified—for yourself—what made it meaningful. The act of writing forces that clarity. But most resume builders rush you past this step. They want you to fill in the blanks and move on.
          </Typography>
          <Typography variant="body1" paragraph sx={{ fontSize: '1.125rem', lineHeight: 1.7 }}>
            The Career Quill slows you down in the right places. It gives you space to think about your experience section by section, to craft bullet points that actually say something, to iterate on your summary until it feels true. It provides structure without constraint—clean templates that work with ATS systems but don&apos;t dictate your story.
          </Typography>
          <Typography variant="body1" paragraph sx={{ fontSize: '1.125rem', lineHeight: 1.7 }}>
            And when you need feedback, the Resume Analyzer uses AI to review your content—not to rewrite it in some algorithmic voice, but to highlight gaps, suggest stronger phrasing, and point out where you might be underselling yourself. Think of it as a writing partner who asks good questions rather than a robot trying to optimize your keywords.
          </Typography>
        </Box>

        <Box component="section" sx={{ mb: 5 }}>
          <Typography variant="h2" component="h2" gutterBottom sx={{ fontSize: '1.75rem', fontWeight: 600, mt: 5, mb: 3 }}>
            Design Philosophy: Intentional Simplicity
          </Typography>
          <Typography variant="body1" paragraph sx={{ fontSize: '1.125rem', lineHeight: 1.7 }}>
            Every design choice in The Career Quill is deliberate. The minimal interface isn&apos;t about looking trendy—it&apos;s about removing distractions so you can focus on what matters. The typography prioritizes readability. The color palette is restrained because your content should be the most important thing on the page, not the UI chrome around it.
          </Typography>
          <Typography variant="body1" paragraph sx={{ fontSize: '1.125rem', lineHeight: 1.7 }}>
            I believe tools should feel like extensions of your thinking, not obstacles to navigate. That means prioritizing:
          </Typography>
          <Box component="ul" sx={{ pl: 4, mb: 3 }}>
            <li>
              <Typography variant="body1" paragraph sx={{ fontSize: '1.125rem', lineHeight: 1.7 }}>
                <strong>Clarity over cleverness:</strong> No hidden features, no confusing navigation, no mystery meat icons. Everything should be exactly where you expect it to be.
              </Typography>
            </li>
            <li>
              <Typography variant="body1" paragraph sx={{ fontSize: '1.125rem', lineHeight: 1.7 }}>
                <strong>Privacy by default:</strong> Your resume data lives in your browser, not on our servers. You own it. You control it. We don&apos;t monetize your career story.
              </Typography>
            </li>
            <li>
              <Typography variant="body1" paragraph sx={{ fontSize: '1.125rem', lineHeight: 1.7 }}>
                <strong>Guidance without prescription:</strong> The tool suggests, but you decide. It helps you think through structure and phrasing, but the final voice is yours.
              </Typography>
            </li>
            <li>
              <Typography variant="body1" paragraph sx={{ fontSize: '1.125rem', lineHeight: 1.7 }}>
                <strong>Accessibility as core:</strong> Everyone deserves tools that work with their needs—screen readers, keyboard navigation, high contrast modes. This isn&apos;t a nice-to-have; it&apos;s foundational.
              </Typography>
            </li>
          </Box>
          <Typography variant="body1" paragraph sx={{ fontSize: '1.125rem', lineHeight: 1.7 }}>
            The Career Quill is opinionated about user experience but flexible about content. It won&apos;t lock you into a rigid structure or force you to describe your work in a specific way. Instead, it provides enough structure to keep you moving forward and enough flexibility to let your story breathe.
          </Typography>
        </Box>

        <Box component="section" sx={{ mb: 5 }}>
          <Typography variant="h2" component="h2" gutterBottom sx={{ fontSize: '1.75rem', fontWeight: 600, mt: 5, mb: 3 }}>
            Building Confidence Through Better Tools
          </Typography>
          <Typography variant="body1" paragraph sx={{ fontSize: '1.125rem', lineHeight: 1.7 }}>
            Here&apos;s something I&apos;ve learned: confidence in your career narrative doesn&apos;t come from having the most impressive credentials. It comes from being able to articulate your experience in a way that feels honest and coherent.
          </Typography>
          <Typography variant="body1" paragraph sx={{ fontSize: '1.125rem', lineHeight: 1.7 }}>
            When you can look at your resume and think, &quot;Yes, this is what I&apos;ve done, and I can explain why it matters,&quot; that clarity translates into interviews, networking conversations, and how you think about your own growth. You stop second-guessing yourself because you&apos;ve done the work of understanding your own story.
          </Typography>
          <Typography variant="body1" paragraph sx={{ fontSize: '1.125rem', lineHeight: 1.7 }}>
            The Career Quill is designed to facilitate that process. It&apos;s not magic—it won&apos;t make you qualified for roles you aren&apos;t ready for, and it won&apos;t turn weak experience into strong experience. But it will help you see what you&apos;ve accomplished more clearly, write about it more effectively, and present it more confidently.
          </Typography>
          <Typography variant="body1" paragraph sx={{ fontSize: '1.125rem', lineHeight: 1.7 }}>
            Sometimes the difference between a forgettable resume and a memorable one isn&apos;t the content—it&apos;s the clarity. And clarity is a skill you can develop with the right tools and the right mindset.
          </Typography>
        </Box>

        <Box component="section" sx={{ mb: 5 }}>
          <Typography variant="h2" component="h2" gutterBottom sx={{ fontSize: '1.75rem', fontWeight: 600, mt: 5, mb: 3 }}>
            About the Creator
          </Typography>
          <Typography variant="body1" paragraph sx={{ fontSize: '1.125rem', lineHeight: 1.7 }}>
            I&apos;m Jonathan Branski, a software engineer and designer who believes that good tools should empower people, not overwhelm them.
          </Typography>
          <Typography variant="body1" paragraph sx={{ fontSize: '1.125rem', lineHeight: 1.7 }}>
            My background is a bit of a mix. I&apos;m currently pursuing a Master&apos;s in Computer Science with a specialization in Human-Computer Interaction and AI at Georgia Tech, where I focus on how technology can enhance rather than replace human creativity and decision-making. Before that, I worked across creative and technical domains—building software, designing user experiences, and running Fox & Crow Studio, where I help individuals and small teams communicate their work more effectively.
          </Typography>
          <Typography variant="body1" paragraph sx={{ fontSize: '1.125rem', lineHeight: 1.7 }}>
            Throughout my career, I&apos;ve noticed a pattern: the best tools feel invisible. They don&apos;t demand attention for their own sake. They get out of your way so you can focus on the work that matters. Whether that&apos;s writing code, designing an interface, or crafting a resume, the principle is the same—clarity and purpose over complexity and flash.
          </Typography>
          <Typography variant="body1" paragraph sx={{ fontSize: '1.125rem', lineHeight: 1.7 }}>
            The Career Quill is an extension of that philosophy. It&apos;s the tool I wish I&apos;d had during my own career transitions—something that respected my intelligence, valued my time, and helped me think more clearly about what I&apos;d built and where I wanted to go next.
          </Typography>
          <Typography variant="body1" paragraph sx={{ fontSize: '1.125rem', lineHeight: 1.7 }}>
            If this resonates with you, I&apos;d love to hear your thoughts. You can reach me at dev@jpbranski.com or check out my other work at jpbranski.com.
          </Typography>
        </Box>

        <Box component="section">
          <Typography variant="h2" component="h2" gutterBottom sx={{ fontSize: '1.75rem', fontWeight: 600, mt: 5, mb: 3 }}>
            What&apos;s Next
          </Typography>
          <Typography variant="body1" paragraph sx={{ fontSize: '1.125rem', lineHeight: 1.7 }}>
            The Career Quill is a living project. I&apos;m continually refining the templates, improving the AI feedback, and adding features that genuinely help people write better career narratives. But I&apos;m also conscious of not adding features just for the sake of it. Every addition needs to serve the core mission: helping you articulate your experience with clarity and confidence.
          </Typography>
          <Typography variant="body1" paragraph sx={{ fontSize: '1.125rem', lineHeight: 1.7 }}>
            If you have ideas, feedback, or just want to share how you&apos;re using the tool, I&apos;m listening. This project exists because I believe we deserve better tools for career storytelling. Together, we can make it even better.
          </Typography>
        </Box>
      </Box>
    </Container>
  );
}
