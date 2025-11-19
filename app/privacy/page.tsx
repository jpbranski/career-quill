import React from 'react';
import { Container, Typography, Box, Link as MuiLink } from '@mui/material';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy - Career Quill',
  description: 'Privacy Policy for Career Quill - Learn how we protect your data and respect your privacy.',
};

export default function PrivacyPage() {
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
          Privacy Policy
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
          Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
        </Typography>

        <Box component="section" sx={{ mb: 4 }}>
          <Typography variant="body1" paragraph>
            The Career Quill is a career development tool that helps you build professional resumes, analyze your resume content, and create compelling career portfolios. We are committed to protecting your privacy and being transparent about how we handle your information.
          </Typography>
          <Typography variant="body1" paragraph>
            This Privacy Policy explains what information we collect, how we use it, and your rights regarding your data. By using The Career Quill, you agree to the practices described in this policy.
          </Typography>
        </Box>

        <Box component="section" sx={{ mb: 4 }}>
          <Typography variant="h2" component="h2" gutterBottom sx={{ fontSize: '1.75rem', fontWeight: 600, mt: 4, mb: 2 }}>
            1. Information We Collect
          </Typography>

          <Typography variant="h3" component="h3" sx={{ fontSize: '1.25rem', fontWeight: 600, mt: 3, mb: 1.5 }}>
            Information You Provide
          </Typography>
          <Typography variant="body1" paragraph>
            When you use The Career Quill, you may provide:
          </Typography>
          <Box component="ul" sx={{ pl: 4, mb: 2 }}>
            <li>
              <Typography variant="body1" paragraph>
                <strong>Resume Data:</strong> Personal information including your name, contact details, work experience, education, skills, and projects that you enter into the Resume Builder.
              </Typography>
            </li>
            <li>
              <Typography variant="body1" paragraph>
                <strong>Uploaded Files:</strong> Resume files (PDF, DOCX, or text) that you upload to the Resume Analyzer for AI-powered feedback.
              </Typography>
            </li>
            <li>
              <Typography variant="body1" paragraph>
                <strong>Cookie Preferences:</strong> Your choices regarding analytics and advertising cookies.
              </Typography>
            </li>
          </Box>

          <Typography variant="h3" component="h3" sx={{ fontSize: '1.25rem', fontWeight: 600, mt: 3, mb: 1.5 }}>
            Automatically Collected Information
          </Typography>
          <Typography variant="body1" paragraph>
            When you visit our site, we may automatically collect:
          </Typography>
          <Box component="ul" sx={{ pl: 4, mb: 2 }}>
            <li>
              <Typography variant="body1" paragraph>
                <strong>Usage Data:</strong> Information about how you interact with the site, such as pages visited, features used, and time spent on the site.
              </Typography>
            </li>
            <li>
              <Typography variant="body1" paragraph>
                <strong>Device Information:</strong> Browser type, operating system, IP address, and device identifiers.
              </Typography>
            </li>
            <li>
              <Typography variant="body1" paragraph>
                <strong>Analytics Data:</strong> Aggregated usage statistics collected through Google Analytics (only if you consent via our cookie banner).
              </Typography>
            </li>
          </Box>
        </Box>

        <Box component="section" sx={{ mb: 4 }}>
          <Typography variant="h2" component="h2" gutterBottom sx={{ fontSize: '1.75rem', fontWeight: 600, mt: 4, mb: 2 }}>
            2. How We Use Your Information
          </Typography>
          <Typography variant="body1" paragraph>
            We use the information we collect to:
          </Typography>
          <Box component="ul" sx={{ pl: 4, mb: 2 }}>
            <li>
              <Typography variant="body1" paragraph>
                <strong>Provide Core Features:</strong> Store your resume data locally on your device and enable you to build, edit, and export your resume.
              </Typography>
            </li>
            <li>
              <Typography variant="body1" paragraph>
                <strong>AI Analysis:</strong> Process resume content you submit for analysis using AI-powered tools to provide feedback and suggestions.
              </Typography>
            </li>
            <li>
              <Typography variant="body1" paragraph>
                <strong>Improve Our Service:</strong> Understand how users interact with the site to enhance features, fix bugs, and optimize performance.
              </Typography>
            </li>
            <li>
              <Typography variant="body1" paragraph>
                <strong>Security and Fraud Prevention:</strong> Detect and prevent abuse, spam, and unauthorized access through rate limiting and reCAPTCHA verification.
              </Typography>
            </li>
            <li>
              <Typography variant="body1" paragraph>
                <strong>Analytics:</strong> Generate aggregate statistics about site usage (only with your consent).
              </Typography>
            </li>
          </Box>
        </Box>

        <Box component="section" sx={{ mb: 4 }}>
          <Typography variant="h2" component="h2" gutterBottom sx={{ fontSize: '1.75rem', fontWeight: 600, mt: 4, mb: 2 }}>
            3. Cookies and Tracking Technologies
          </Typography>
          <Typography variant="body1" paragraph>
            The Career Quill uses cookies and similar technologies to enhance your experience:
          </Typography>
          <Box component="ul" sx={{ pl: 4, mb: 2 }}>
            <li>
              <Typography variant="body1" paragraph>
                <strong>Essential Cookies:</strong> Required for basic site functionality, including storing your theme preference (light/dark mode) and cookie consent choices. These cannot be disabled.
              </Typography>
            </li>
            <li>
              <Typography variant="body1" paragraph>
                <strong>Analytics Cookies:</strong> Google Analytics cookies that help us understand site usage and performance. These are only activated if you provide consent via our cookie banner.
              </Typography>
            </li>
            <li>
              <Typography variant="body1" paragraph>
                <strong>Advertising Cookies:</strong> Google AdSense cookies that enable personalized advertising. These are only activated if you provide consent.
              </Typography>
            </li>
          </Box>
          <Typography variant="body1" paragraph>
            You can manage your cookie preferences at any time through our cookie consent banner. Note that disabling certain cookies may limit some features of the site.
          </Typography>
        </Box>

        <Box component="section" sx={{ mb: 4 }}>
          <Typography variant="h2" component="h2" gutterBottom sx={{ fontSize: '1.75rem', fontWeight: 600, mt: 4, mb: 2 }}>
            4. Third-Party Services
          </Typography>
          <Typography variant="body1" paragraph>
            The Career Quill integrates with the following third-party services:
          </Typography>
          <Box component="ul" sx={{ pl: 4, mb: 2 }}>
            <li>
              <Typography variant="body1" paragraph>
                <strong>OpenAI:</strong> We use OpenAI&apos;s API to provide AI-powered resume analysis. When you submit a resume for analysis, the content is sent to OpenAI for processing. OpenAI&apos;s use of data is governed by their{' '}
                <MuiLink href="https://openai.com/privacy" target="_blank" rel="noopener noreferrer" underline="hover">
                  privacy policy
                </MuiLink>.
              </Typography>
            </li>
            <li>
              <Typography variant="body1" paragraph>
                <strong>Google Analytics:</strong> If you consent, we use Google Analytics to understand site traffic and usage patterns. Google&apos;s privacy practices are described in their{' '}
                <MuiLink href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" underline="hover">
                  privacy policy
                </MuiLink>.
              </Typography>
            </li>
            <li>
              <Typography variant="body1" paragraph>
                <strong>Google AdSense:</strong> If you consent, we display advertisements via Google AdSense. Google&apos;s advertising practices are outlined in their{' '}
                <MuiLink href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer" underline="hover">
                  advertising policy
                </MuiLink>.
              </Typography>
            </li>
            <li>
              <Typography variant="body1" paragraph>
                <strong>Google reCAPTCHA:</strong> We use reCAPTCHA v3 to prevent spam and abuse on the Resume Analyzer. reCAPTCHA&apos;s data collection is governed by Google&apos;s{' '}
                <MuiLink href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" underline="hover">
                  privacy policy
                </MuiLink>.
              </Typography>
            </li>
          </Box>
        </Box>

        <Box component="section" sx={{ mb: 4 }}>
          <Typography variant="h2" component="h2" gutterBottom sx={{ fontSize: '1.75rem', fontWeight: 600, mt: 4, mb: 2 }}>
            5. Data Storage and Security
          </Typography>
          <Typography variant="body1" paragraph>
            <strong>Local Storage:</strong> The Career Quill stores your resume data locally in your browser using localStorage. This means your resume information never leaves your device unless you explicitly use the Resume Analyzer feature. You have complete control over this data and can clear it at any time through your browser settings.
          </Typography>
          <Typography variant="body1" paragraph>
            <strong>Server Data:</strong> When you use the Resume Analyzer, your resume content is temporarily processed by our server and sent to OpenAI for analysis. We do not permanently store resume content on our servers after the analysis is complete.
          </Typography>
          <Typography variant="body1" paragraph>
            <strong>Security Measures:</strong> We implement industry-standard security practices to protect your data, including HTTPS encryption for all data transmission, rate limiting to prevent abuse, and secure API key management for third-party integrations.
          </Typography>
        </Box>

        <Box component="section" sx={{ mb: 4 }}>
          <Typography variant="h2" component="h2" gutterBottom sx={{ fontSize: '1.75rem', fontWeight: 600, mt: 4, mb: 2 }}>
            6. Data Retention
          </Typography>
          <Typography variant="body1" paragraph>
            <strong>Resume Data:</strong> Data you create in the Resume Builder is stored indefinitely in your browser&apos;s local storage until you manually delete it or clear your browser data.
          </Typography>
          <Typography variant="body1" paragraph>
            <strong>Analysis Requests:</strong> Resume content submitted for AI analysis is not retained on our servers after the analysis is completed and results are returned to you.
          </Typography>
          <Typography variant="body1" paragraph>
            <strong>Cookies:</strong> Cookie data is retained according to the expiration periods set by the respective cookie. You can delete cookies at any time through your browser settings.
          </Typography>
        </Box>

        <Box component="section" sx={{ mb: 4 }}>
          <Typography variant="h2" component="h2" gutterBottom sx={{ fontSize: '1.75rem', fontWeight: 600, mt: 4, mb: 2 }}>
            7. Your Rights and Choices
          </Typography>
          <Typography variant="body1" paragraph>
            You have the following rights regarding your data:
          </Typography>
          <Box component="ul" sx={{ pl: 4, mb: 2 }}>
            <li>
              <Typography variant="body1" paragraph>
                <strong>Access and Control:</strong> You can view, edit, and delete your resume data at any time through the Resume Builder interface or by clearing your browser&apos;s local storage.
              </Typography>
            </li>
            <li>
              <Typography variant="body1" paragraph>
                <strong>Cookie Preferences:</strong> You can update your cookie consent choices at any time through the cookie consent banner.
              </Typography>
            </li>
            <li>
              <Typography variant="body1" paragraph>
                <strong>Do Not Track:</strong> We respect Do Not Track (DNT) browser signals and will not track your activity if you have DNT enabled.
              </Typography>
            </li>
            <li>
              <Typography variant="body1" paragraph>
                <strong>Data Portability:</strong> You can export your resume data in multiple formats (PDF, DOCX, TXT) at any time.
              </Typography>
            </li>
          </Box>
        </Box>

        <Box component="section" sx={{ mb: 4 }}>
          <Typography variant="h2" component="h2" gutterBottom sx={{ fontSize: '1.75rem', fontWeight: 600, mt: 4, mb: 2 }}>
            8. Children&apos;s Privacy
          </Typography>
          <Typography variant="body1" paragraph>
            The Career Quill is not intended for use by individuals under the age of 13. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us so we can delete it.
          </Typography>
        </Box>

        <Box component="section" sx={{ mb: 4 }}>
          <Typography variant="h2" component="h2" gutterBottom sx={{ fontSize: '1.75rem', fontWeight: 600, mt: 4, mb: 2 }}>
            9. Changes to This Privacy Policy
          </Typography>
          <Typography variant="body1" paragraph>
            We may update this Privacy Policy from time to time to reflect changes in our practices or for legal, operational, or regulatory reasons. When we make changes, we will update the &quot;Last Updated&quot; date at the top of this page. We encourage you to review this policy periodically to stay informed about how we protect your information.
          </Typography>
          <Typography variant="body1" paragraph>
            If we make material changes that significantly affect your privacy rights, we will provide prominent notice on the site before the changes take effect.
          </Typography>
        </Box>

        <Box component="section" sx={{ mb: 4 }}>
          <Typography variant="h2" component="h2" gutterBottom sx={{ fontSize: '1.75rem', fontWeight: 600, mt: 4, mb: 2 }}>
            10. Contact Us
          </Typography>
          <Typography variant="body1" paragraph>
            If you have questions, concerns, or requests regarding this Privacy Policy or how we handle your data, please contact us at:
          </Typography>
          <Typography variant="body1" paragraph>
            Email:{' '}
            <MuiLink href="mailto:dev@jpbranski.com" underline="hover">
              dev@jpbranski.com
            </MuiLink>
          </Typography>
          <Typography variant="body1" paragraph>
            We will respond to your inquiry as promptly as possible.
          </Typography>
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
            <strong>Disclaimer:</strong> This Privacy Policy is provided as a general template and may not address all legal requirements for your specific jurisdiction. It is recommended that you consult with a qualified attorney to ensure compliance with applicable privacy laws and regulations.
          </Typography>
        </Box>
      </Box>
    </Container>
  );
}
