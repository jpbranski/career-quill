import React from 'react';
import { Container, Typography, Box, Link as MuiLink } from '@mui/material';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Accessibility Statement - Career Quill',
  description: 'Accessibility commitment for Career Quill - Making our platform usable for everyone.',
};

export default function AccessibilityPage() {
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
            mb: 2,
          }}
        >
          Accessibility Statement
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
          Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
        </Typography>

        <Box component="section" sx={{ mb: 4 }}>
          <Typography variant="h2" component="h2" gutterBottom sx={{ fontSize: '1.75rem', fontWeight: 600, mt: 4, mb: 2 }}>
            Our Commitment to Accessibility
          </Typography>
          <Typography variant="body1" paragraph>
            The Career Quill is committed to ensuring digital accessibility for all users, including people with disabilities. We believe that everyone should have equal access to career development tools and resources, regardless of their abilities or the assistive technologies they use.
          </Typography>
          <Typography variant="body1" paragraph>
            We are continuously working to improve the accessibility and usability of our platform to ensure it provides a positive, inclusive experience for all users. Accessibility is not a one-time effort but an ongoing commitment to inclusivity and universal design.
          </Typography>
        </Box>

        <Box component="section" sx={{ mb: 4 }}>
          <Typography variant="h2" component="h2" gutterBottom sx={{ fontSize: '1.75rem', fontWeight: 600, mt: 4, mb: 2 }}>
            Accessibility Standards
          </Typography>
          <Typography variant="body1" paragraph>
            The Career Quill aims to conform to the{' '}
            <MuiLink
              href="https://www.w3.org/WAI/WCAG21/quickref/"
              target="_blank"
              rel="noopener noreferrer"
              underline="hover"
            >
              Web Content Accessibility Guidelines (WCAG) 2.1
            </MuiLink>{' '}
            at the AA level. These guidelines are internationally recognized standards for web accessibility and outline how to make web content more accessible to people with a wide range of disabilities.
          </Typography>
          <Typography variant="body1" paragraph>
            WCAG 2.1 AA compliance addresses:
          </Typography>
          <Box component="ul" sx={{ pl: 4, mb: 2 }}>
            <li>
              <Typography variant="body1" paragraph>
                <strong>Perceivable:</strong> Information and user interface components must be presentable to users in ways they can perceive.
              </Typography>
            </li>
            <li>
              <Typography variant="body1" paragraph>
                <strong>Operable:</strong> User interface components and navigation must be operable by all users.
              </Typography>
            </li>
            <li>
              <Typography variant="body1" paragraph>
                <strong>Understandable:</strong> Information and operation of the user interface must be understandable.
              </Typography>
            </li>
            <li>
              <Typography variant="body1" paragraph>
                <strong>Robust:</strong> Content must be robust enough to be interpreted reliably by a wide variety of user agents, including assistive technologies.
              </Typography>
            </li>
          </Box>
        </Box>

        <Box component="section" sx={{ mb: 4 }}>
          <Typography variant="h2" component="h2" gutterBottom sx={{ fontSize: '1.75rem', fontWeight: 600, mt: 4, mb: 2 }}>
            Accessibility Features
          </Typography>
          <Typography variant="body1" paragraph>
            We have implemented the following features to enhance accessibility on The Career Quill:
          </Typography>

          <Typography variant="h3" component="h3" sx={{ fontSize: '1.25rem', fontWeight: 600, mt: 3, mb: 1.5 }}>
            Keyboard Navigation
          </Typography>
          <Box component="ul" sx={{ pl: 4, mb: 2 }}>
            <li>
              <Typography variant="body1" paragraph>
                All interactive elements are keyboard accessible and can be navigated using the Tab key.
              </Typography>
            </li>
            <li>
              <Typography variant="body1" paragraph>
                Logical tab order follows the visual flow of the page.
              </Typography>
            </li>
            <li>
              <Typography variant="body1" paragraph>
                Focus indicators are clearly visible to help keyboard users track their position.
              </Typography>
            </li>
            <li>
              <Typography variant="body1" paragraph>
                Keyboard shortcuts and navigation patterns follow standard web conventions.
              </Typography>
            </li>
          </Box>

          <Typography variant="h3" component="h3" sx={{ fontSize: '1.25rem', fontWeight: 600, mt: 3, mb: 1.5 }}>
            Screen Reader Support
          </Typography>
          <Box component="ul" sx={{ pl: 4, mb: 2 }}>
            <li>
              <Typography variant="body1" paragraph>
                Semantic HTML elements (headings, lists, landmarks, forms) provide proper document structure.
              </Typography>
            </li>
            <li>
              <Typography variant="body1" paragraph>
                ARIA (Accessible Rich Internet Applications) labels and attributes are used to provide context where needed.
              </Typography>
            </li>
            <li>
              <Typography variant="body1" paragraph>
                Images and icons include descriptive alt text or are marked as decorative when appropriate.
              </Typography>
            </li>
            <li>
              <Typography variant="body1" paragraph>
                Form fields have associated labels and helpful error messages.
              </Typography>
            </li>
            <li>
              <Typography variant="body1" paragraph>
                The site has been tested with popular screen readers including NVDA, JAWS, and VoiceOver.
              </Typography>
            </li>
          </Box>

          <Typography variant="h3" component="h3" sx={{ fontSize: '1.25rem', fontWeight: 600, mt: 3, mb: 1.5 }}>
            Visual Accessibility
          </Typography>
          <Box component="ul" sx={{ pl: 4, mb: 2 }}>
            <li>
              <Typography variant="body1" paragraph>
                Color contrast ratios meet or exceed WCAG AA standards (4.5:1 for normal text, 3:1 for large text).
              </Typography>
            </li>
            <li>
              <Typography variant="body1" paragraph>
                Information is not conveyed by color alone; we use text, icons, and patterns as additional indicators.
              </Typography>
            </li>
            <li>
              <Typography variant="body1" paragraph>
                Light and dark theme options are available to accommodate different visual preferences and reduce eye strain.
              </Typography>
            </li>
            <li>
              <Typography variant="body1" paragraph>
                Text is resizable up to 200% without loss of content or functionality.
              </Typography>
            </li>
            <li>
              <Typography variant="body1" paragraph>
                Fonts are legible and use sufficient spacing for comfortable reading.
              </Typography>
            </li>
          </Box>

          <Typography variant="h3" component="h3" sx={{ fontSize: '1.25rem', fontWeight: 600, mt: 3, mb: 1.5 }}>
            Responsive and Adaptive Design
          </Typography>
          <Box component="ul" sx={{ pl: 4, mb: 2 }}>
            <li>
              <Typography variant="body1" paragraph>
                The site is fully responsive and works across different devices and screen sizes.
              </Typography>
            </li>
            <li>
              <Typography variant="body1" paragraph>
                Content reflows and adapts to different viewport sizes without requiring horizontal scrolling.
              </Typography>
            </li>
            <li>
              <Typography variant="body1" paragraph>
                Touch targets are appropriately sized (minimum 44x44 pixels) for users with motor impairments.
              </Typography>
            </li>
          </Box>

          <Typography variant="h3" component="h3" sx={{ fontSize: '1.25rem', fontWeight: 600, mt: 3, mb: 1.5 }}>
            Content Structure
          </Typography>
          <Box component="ul" sx={{ pl: 4, mb: 2 }}>
            <li>
              <Typography variant="body1" paragraph>
                Headings are hierarchically structured (H1, H2, H3, etc.) to create a clear content outline.
              </Typography>
            </li>
            <li>
              <Typography variant="body1" paragraph>
                Page titles are descriptive and unique to help with navigation.
              </Typography>
            </li>
            <li>
              <Typography variant="body1" paragraph>
                Content is written in plain language to be understandable for a wide audience.
              </Typography>
            </li>
            <li>
              <Typography variant="body1" paragraph>
                Link text is descriptive and makes sense out of context.
              </Typography>
            </li>
          </Box>
        </Box>

        <Box component="section" sx={{ mb: 4 }}>
          <Typography variant="h2" component="h2" gutterBottom sx={{ fontSize: '1.75rem', fontWeight: 600, mt: 4, mb: 2 }}>
            Assistive Technologies
          </Typography>
          <Typography variant="body1" paragraph>
            The Career Quill is designed to be compatible with common assistive technologies, including:
          </Typography>
          <Box component="ul" sx={{ pl: 4, mb: 2 }}>
            <li>
              <Typography variant="body1" paragraph>
                <strong>Screen Readers:</strong> NVDA, JAWS, VoiceOver, TalkBack, and other popular screen reading software.
              </Typography>
            </li>
            <li>
              <Typography variant="body1" paragraph>
                <strong>Screen Magnification:</strong> ZoomText, Windows Magnifier, and browser zoom functionality.
              </Typography>
            </li>
            <li>
              <Typography variant="body1" paragraph>
                <strong>Speech Recognition:</strong> Dragon NaturallySpeaking and voice control systems.
              </Typography>
            </li>
            <li>
              <Typography variant="body1" paragraph>
                <strong>Alternative Input Devices:</strong> Switch controls, head pointers, eye-tracking systems, and other adaptive devices.
              </Typography>
            </li>
            <li>
              <Typography variant="body1" paragraph>
                <strong>Browser Accessibility Features:</strong> High contrast modes, reader views, and custom stylesheets.
              </Typography>
            </li>
          </Box>
        </Box>

        <Box component="section" sx={{ mb: 4 }}>
          <Typography variant="h2" component="h2" gutterBottom sx={{ fontSize: '1.75rem', fontWeight: 600, mt: 4, mb: 2 }}>
            Known Limitations
          </Typography>
          <Typography variant="body1" paragraph>
            While we strive to maintain the highest accessibility standards, we acknowledge that some aspects of our platform may not yet be fully optimized:
          </Typography>
          <Box component="ul" sx={{ pl: 4, mb: 2 }}>
            <li>
              <Typography variant="body1" paragraph>
                Some third-party integrations (such as reCAPTCHA) may have their own accessibility limitations.
              </Typography>
            </li>
            <li>
              <Typography variant="body1" paragraph>
                PDF and DOCX export formats depend on browser-generated outputs, which may have varying levels of accessibility.
              </Typography>
            </li>
            <li>
              <Typography variant="body1" paragraph>
                Complex interactive features such as drag-and-drop section reordering may require keyboard alternatives, which we are continuously improving.
              </Typography>
            </li>
          </Box>
          <Typography variant="body1" paragraph>
            We are actively working to address these limitations and welcome your feedback on how we can improve.
          </Typography>
        </Box>

        <Box component="section" sx={{ mb: 4 }}>
          <Typography variant="h2" component="h2" gutterBottom sx={{ fontSize: '1.75rem', fontWeight: 600, mt: 4, mb: 2 }}>
            Ongoing Improvements
          </Typography>
          <Typography variant="body1" paragraph>
            Accessibility is an ongoing process, and we are committed to continuous improvement. Our efforts include:
          </Typography>
          <Box component="ul" sx={{ pl: 4, mb: 2 }}>
            <li>
              <Typography variant="body1" paragraph>
                Regular accessibility audits and testing with assistive technologies.
              </Typography>
            </li>
            <li>
              <Typography variant="body1" paragraph>
                User testing with people who use assistive technologies.
              </Typography>
            </li>
            <li>
              <Typography variant="body1" paragraph>
                Staying current with accessibility best practices and evolving standards.
              </Typography>
            </li>
            <li>
              <Typography variant="body1" paragraph>
                Training our development team on accessibility principles and inclusive design.
              </Typography>
            </li>
            <li>
              <Typography variant="body1" paragraph>
                Prioritizing accessibility in all new features and updates.
              </Typography>
            </li>
          </Box>
        </Box>

        <Box component="section" sx={{ mb: 4 }}>
          <Typography variant="h2" component="h2" gutterBottom sx={{ fontSize: '1.75rem', fontWeight: 600, mt: 4, mb: 2 }}>
            Feedback and Contact
          </Typography>
          <Typography variant="body1" paragraph>
            We welcome your feedback on the accessibility of The Career Quill. If you encounter any accessibility barriers while using our platform, please let us know so we can address them promptly.
          </Typography>
          <Typography variant="body1" paragraph>
            When reporting accessibility issues, please include:
          </Typography>
          <Box component="ul" sx={{ pl: 4, mb: 2 }}>
            <li>
              <Typography variant="body1" paragraph>
                The page or feature where you encountered the issue.
              </Typography>
            </li>
            <li>
              <Typography variant="body1" paragraph>
                A description of the problem and how it affects your ability to use the site.
              </Typography>
            </li>
            <li>
              <Typography variant="body1" paragraph>
                The assistive technology you are using (if applicable), including name and version.
              </Typography>
            </li>
            <li>
              <Typography variant="body1" paragraph>
                Your browser and operating system.
              </Typography>
            </li>
          </Box>
          <Typography variant="body1" paragraph>
            You can contact us regarding accessibility at:
          </Typography>
          <Typography variant="body1" paragraph>
            Email:{' '}
            <MuiLink href="mailto:dev@jpbranski.com" underline="hover">
              dev@jpbranski.com
            </MuiLink>
          </Typography>
          <Typography variant="body1" paragraph>
            We aim to respond to accessibility inquiries within 2 business days and will work with you to provide an accessible alternative or resolve the issue as quickly as possible.
          </Typography>
        </Box>

        <Box component="section" sx={{ mb: 4 }}>
          <Typography variant="h2" component="h2" gutterBottom sx={{ fontSize: '1.75rem', fontWeight: 600, mt: 4, mb: 2 }}>
            Third-Party Content
          </Typography>
          <Typography variant="body1" paragraph>
            Some content on The Career Quill may be provided by third-party services (such as AI-generated suggestions from OpenAI). While we strive to ensure all content is accessible, we may have limited control over the accessibility of third-party content. If you encounter issues with third-party content, please let us know so we can work with our partners to improve accessibility.
          </Typography>
        </Box>

        <Box component="section" sx={{ mb: 4 }}>
          <Typography variant="h2" component="h2" gutterBottom sx={{ fontSize: '1.75rem', fontWeight: 600, mt: 4, mb: 2 }}>
            Accessibility Resources
          </Typography>
          <Typography variant="body1" paragraph>
            If you would like to learn more about web accessibility, the following resources may be helpful:
          </Typography>
          <Box component="ul" sx={{ pl: 4, mb: 2 }}>
            <li>
              <Typography variant="body1" paragraph>
                <MuiLink
                  href="https://www.w3.org/WAI/"
                  target="_blank"
                  rel="noopener noreferrer"
                  underline="hover"
                >
                  Web Accessibility Initiative (WAI)
                </MuiLink>
                {' '}— Comprehensive accessibility resources and guidelines.
              </Typography>
            </li>
            <li>
              <Typography variant="body1" paragraph>
                <MuiLink
                  href="https://www.w3.org/WAI/WCAG21/quickref/"
                  target="_blank"
                  rel="noopener noreferrer"
                  underline="hover"
                >
                  WCAG 2.1 Quick Reference
                </MuiLink>
                {' '}— A customizable quick reference to WCAG 2.1 requirements.
              </Typography>
            </li>
            <li>
              <Typography variant="body1" paragraph>
                <MuiLink
                  href="https://www.a11yproject.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  underline="hover"
                >
                  The A11Y Project
                </MuiLink>
                {' '}— Community-driven accessibility resources.
              </Typography>
            </li>
            <li>
              <Typography variant="body1" paragraph>
                <MuiLink
                  href="https://webaim.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  underline="hover"
                >
                  WebAIM
                </MuiLink>
                {' '}— Web accessibility training and resources.
              </Typography>
            </li>
          </Box>
        </Box>

        <Box
          sx={{
            mt: 6,
            p: 3,
            backgroundColor: 'background.default',
            borderRadius: 2,
            borderLeft: '4px solid',
            borderColor: 'primary.main',
          }}
        >
          <Typography variant="body2" color="text.secondary">
            <strong>Note:</strong> This Accessibility Statement reflects our current efforts and commitment to accessibility. We recognize that accessibility is a journey, not a destination, and we are dedicated to making continuous improvements to ensure The Career Quill is usable by everyone.
          </Typography>
        </Box>
      </Box>
    </Container>
  );
}
