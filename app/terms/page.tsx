import React from 'react';
import { Container, Typography, Box, Link as MuiLink } from '@mui/material';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service - Career Quill',
  description: 'Terms of Service for Career Quill - Understanding your rights and responsibilities.',
};

export default function TermsPage() {
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
          Terms of Service
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
          Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
        </Typography>

        <Box component="section" sx={{ mb: 4 }}>
          <Typography variant="body1" paragraph>
            Welcome to The Career Quill. These Terms of Service (&quot;Terms&quot;) govern your access to and use of our website and services. Please read these Terms carefully before using The Career Quill.
          </Typography>
          <Typography variant="body1" paragraph>
            By accessing or using The Career Quill, you agree to be bound by these Terms. If you do not agree to these Terms, please do not use our service.
          </Typography>
        </Box>

        <Box component="section" sx={{ mb: 4 }}>
          <Typography variant="h2" component="h2" gutterBottom sx={{ fontSize: '1.75rem', fontWeight: 600, mt: 4, mb: 2 }}>
            1. Acceptance of Terms
          </Typography>
          <Typography variant="body1" paragraph>
            By creating an account, accessing our website, or using any of our services, you acknowledge that you have read, understood, and agree to be bound by these Terms, as well as our{' '}
            <MuiLink href="/privacy" underline="hover">
              Privacy Policy
            </MuiLink>
            . These Terms constitute a legally binding agreement between you and The Career Quill.
          </Typography>
          <Typography variant="body1" paragraph>
            We reserve the right to modify these Terms at any time. Changes will be effective immediately upon posting to the site. Your continued use of The Career Quill after changes are posted constitutes your acceptance of the modified Terms.
          </Typography>
        </Box>

        <Box component="section" sx={{ mb: 4 }}>
          <Typography variant="h2" component="h2" gutterBottom sx={{ fontSize: '1.75rem', fontWeight: 600, mt: 4, mb: 2 }}>
            2. Eligibility
          </Typography>
          <Typography variant="body1" paragraph>
            You must be at least 13 years of age to use The Career Quill. By using our service, you represent and warrant that you meet this age requirement and have the legal capacity to enter into these Terms.
          </Typography>
          <Typography variant="body1" paragraph>
            If you are using The Career Quill on behalf of an organization, you represent that you have the authority to bind that organization to these Terms.
          </Typography>
        </Box>

        <Box component="section" sx={{ mb: 4 }}>
          <Typography variant="h2" component="h2" gutterBottom sx={{ fontSize: '1.75rem', fontWeight: 600, mt: 4, mb: 2 }}>
            3. Description of Service
          </Typography>
          <Typography variant="body1" paragraph>
            The Career Quill is a career development platform that provides:
          </Typography>
          <Box component="ul" sx={{ pl: 4, mb: 2 }}>
            <li>
              <Typography variant="body1" paragraph>
                <strong>Resume Builder:</strong> Tools to create, edit, format, and export professional resumes in multiple formats (PDF, DOCX, TXT).
              </Typography>
            </li>
            <li>
              <Typography variant="body1" paragraph>
                <strong>Resume Analyzer:</strong> AI-powered analysis of resume content to provide feedback, suggestions, and improvement recommendations.
              </Typography>
            </li>
            <li>
              <Typography variant="body1" paragraph>
                <strong>Template Library:</strong> A collection of professional resume templates designed for different industries and career stages.
              </Typography>
            </li>
          </Box>
          <Typography variant="body1" paragraph>
            We reserve the right to modify, suspend, or discontinue any aspect of the service at any time, with or without notice.
          </Typography>
        </Box>

        <Box component="section" sx={{ mb: 4 }}>
          <Typography variant="h2" component="h2" gutterBottom sx={{ fontSize: '1.75rem', fontWeight: 600, mt: 4, mb: 2 }}>
            4. User Responsibilities
          </Typography>
          <Typography variant="body1" paragraph>
            As a user of The Career Quill, you agree to:
          </Typography>
          <Box component="ul" sx={{ pl: 4, mb: 2 }}>
            <li>
              <Typography variant="body1" paragraph>
                Provide accurate, current, and complete information when using our services.
              </Typography>
            </li>
            <li>
              <Typography variant="body1" paragraph>
                Maintain the security of your browser and device, as your resume data is stored locally.
              </Typography>
            </li>
            <li>
              <Typography variant="body1" paragraph>
                Use the service only for lawful purposes and in accordance with these Terms.
              </Typography>
            </li>
            <li>
              <Typography variant="body1" paragraph>
                Not attempt to gain unauthorized access to any part of the service, other users&apos; data, or related systems.
              </Typography>
            </li>
            <li>
              <Typography variant="body1" paragraph>
                Not interfere with or disrupt the service, servers, or networks connected to the service.
              </Typography>
            </li>
            <li>
              <Typography variant="body1" paragraph>
                Comply with all applicable local, state, national, and international laws and regulations.
              </Typography>
            </li>
          </Box>
        </Box>

        <Box component="section" sx={{ mb: 4 }}>
          <Typography variant="h2" component="h2" gutterBottom sx={{ fontSize: '1.75rem', fontWeight: 600, mt: 4, mb: 2 }}>
            5. Prohibited Uses
          </Typography>
          <Typography variant="body1" paragraph>
            You agree not to use The Career Quill to:
          </Typography>
          <Box component="ul" sx={{ pl: 4, mb: 2 }}>
            <li>
              <Typography variant="body1" paragraph>
                Violate any applicable laws, regulations, or third-party rights.
              </Typography>
            </li>
            <li>
              <Typography variant="body1" paragraph>
                Transmit any harmful code, viruses, malware, or other malicious software.
              </Typography>
            </li>
            <li>
              <Typography variant="body1" paragraph>
                Engage in any automated use of the system, such as scraping, data mining, or using bots.
              </Typography>
            </li>
            <li>
              <Typography variant="body1" paragraph>
                Attempt to reverse engineer, decompile, or disassemble any part of the service.
              </Typography>
            </li>
            <li>
              <Typography variant="body1" paragraph>
                Use the service to create resumes containing false, misleading, or fraudulent information.
              </Typography>
            </li>
            <li>
              <Typography variant="body1" paragraph>
                Harass, abuse, or harm another person or entity.
              </Typography>
            </li>
            <li>
              <Typography variant="body1" paragraph>
                Circumvent or disable any security features or rate limiting mechanisms.
              </Typography>
            </li>
            <li>
              <Typography variant="body1" paragraph>
                Resell, redistribute, or commercially exploit the service without express written permission.
              </Typography>
            </li>
          </Box>
        </Box>

        <Box component="section" sx={{ mb: 4 }}>
          <Typography variant="h2" component="h2" gutterBottom sx={{ fontSize: '1.75rem', fontWeight: 600, mt: 4, mb: 2 }}>
            6. Intellectual Property
          </Typography>
          <Typography variant="body1" paragraph>
            <strong>Our Content:</strong> The Career Quill and all of its original content, features, functionality, design, code, resume templates, and branding are owned by The Career Quill and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
          </Typography>
          <Typography variant="body1" paragraph>
            <strong>Your Content:</strong> You retain all ownership rights to the resume content you create using The Career Quill. By using the AI Resume Analyzer, you grant us a limited, temporary license to process your resume content for the purpose of providing analysis and feedback. This license terminates when the analysis is complete.
          </Typography>
          <Typography variant="body1" paragraph>
            <strong>License to Use:</strong> We grant you a limited, non-exclusive, non-transferable, revocable license to access and use The Career Quill for your personal, non-commercial use, subject to these Terms.
          </Typography>
        </Box>

        <Box component="section" sx={{ mb: 4 }}>
          <Typography variant="h2" component="h2" gutterBottom sx={{ fontSize: '1.75rem', fontWeight: 600, mt: 4, mb: 2 }}>
            7. User Content and Data
          </Typography>
          <Typography variant="body1" paragraph>
            The Career Quill stores your resume data locally in your browser. You are solely responsible for:
          </Typography>
          <Box component="ul" sx={{ pl: 4, mb: 2 }}>
            <li>
              <Typography variant="body1" paragraph>
                Backing up your resume data, as we cannot recover data lost due to browser clearing, device failure, or other technical issues.
              </Typography>
            </li>
            <li>
              <Typography variant="body1" paragraph>
                The accuracy, completeness, and legality of the content in your resumes.
              </Typography>
            </li>
            <li>
              <Typography variant="body1" paragraph>
                Ensuring that your resume content does not infringe on any third-party intellectual property rights or violate any laws.
              </Typography>
            </li>
          </Box>
        </Box>

        <Box component="section" sx={{ mb: 4 }}>
          <Typography variant="h2" component="h2" gutterBottom sx={{ fontSize: '1.75rem', fontWeight: 600, mt: 4, mb: 2 }}>
            8. Third-Party Services
          </Typography>
          <Typography variant="body1" paragraph>
            The Career Quill integrates with third-party services (such as OpenAI for AI analysis and Google services for analytics). Your use of these third-party services is subject to their respective terms of service and privacy policies. We are not responsible for the actions, content, or policies of these third parties.
          </Typography>
        </Box>

        <Box component="section" sx={{ mb: 4 }}>
          <Typography variant="h2" component="h2" gutterBottom sx={{ fontSize: '1.75rem', fontWeight: 600, mt: 4, mb: 2 }}>
            9. Disclaimers
          </Typography>
          <Typography variant="body1" paragraph sx={{ textTransform: 'uppercase', fontWeight: 600 }}>
            The Career Quill is provided &quot;as is&quot; and &quot;as available&quot; without warranties of any kind, either express or implied.
          </Typography>
          <Typography variant="body1" paragraph>
            We make no warranties or representations about:
          </Typography>
          <Box component="ul" sx={{ pl: 4, mb: 2 }}>
            <li>
              <Typography variant="body1" paragraph>
                The accuracy, reliability, or completeness of the service or any AI-generated suggestions.
              </Typography>
            </li>
            <li>
              <Typography variant="body1" paragraph>
                The quality of resumes created using our tools or their effectiveness in securing employment.
              </Typography>
            </li>
            <li>
              <Typography variant="body1" paragraph>
                Uninterrupted, error-free, or secure operation of the service.
              </Typography>
            </li>
            <li>
              <Typography variant="body1" paragraph>
                The correction of defects or errors in the service.
              </Typography>
            </li>
          </Box>
          <Typography variant="body1" paragraph>
            <strong>Not Career Advice:</strong> The Career Quill provides tools and AI-powered suggestions, but does not provide professional career counseling, legal advice, or employment guarantees. You should verify all resume content and consider consulting with career professionals before using resumes for job applications.
          </Typography>
        </Box>

        <Box component="section" sx={{ mb: 4 }}>
          <Typography variant="h2" component="h2" gutterBottom sx={{ fontSize: '1.75rem', fontWeight: 600, mt: 4, mb: 2 }}>
            10. Limitation of Liability
          </Typography>
          <Typography variant="body1" paragraph sx={{ textTransform: 'uppercase', fontWeight: 600 }}>
            To the maximum extent permitted by law, The Career Quill and its owners, employees, and affiliates shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses resulting from:
          </Typography>
          <Box component="ul" sx={{ pl: 4, mb: 2 }}>
            <li>
              <Typography variant="body1" paragraph>
                Your use or inability to use the service.
              </Typography>
            </li>
            <li>
              <Typography variant="body1" paragraph>
                Any unauthorized access to or use of our servers or any data stored therein.
              </Typography>
            </li>
            <li>
              <Typography variant="body1" paragraph>
                Any errors, mistakes, or inaccuracies in the service or AI-generated suggestions.
              </Typography>
            </li>
            <li>
              <Typography variant="body1" paragraph>
                Any loss of resume data due to technical failures, browser issues, or user error.
              </Typography>
            </li>
            <li>
              <Typography variant="body1" paragraph>
                Any failure to obtain employment or career advancement based on resumes created using our tools.
              </Typography>
            </li>
          </Box>
          <Typography variant="body1" paragraph>
            Some jurisdictions do not allow the exclusion or limitation of incidental or consequential damages, so the above limitations may not apply to you.
          </Typography>
        </Box>

        <Box component="section" sx={{ mb: 4 }}>
          <Typography variant="h2" component="h2" gutterBottom sx={{ fontSize: '1.75rem', fontWeight: 600, mt: 4, mb: 2 }}>
            11. Indemnification
          </Typography>
          <Typography variant="body1" paragraph>
            You agree to indemnify, defend, and hold harmless The Career Quill and its officers, directors, employees, contractors, agents, and affiliates from and against any claims, liabilities, damages, losses, costs, expenses, or fees (including reasonable attorneys&apos; fees) arising from:
          </Typography>
          <Box component="ul" sx={{ pl: 4, mb: 2 }}>
            <li>
              <Typography variant="body1" paragraph>
                Your use of the service.
              </Typography>
            </li>
            <li>
              <Typography variant="body1" paragraph>
                Your violation of these Terms.
              </Typography>
            </li>
            <li>
              <Typography variant="body1" paragraph>
                Your violation of any rights of another party.
              </Typography>
            </li>
            <li>
              <Typography variant="body1" paragraph>
                Content you submit, post, or transmit through the service.
              </Typography>
            </li>
          </Box>
        </Box>

        <Box component="section" sx={{ mb: 4 }}>
          <Typography variant="h2" component="h2" gutterBottom sx={{ fontSize: '1.75rem', fontWeight: 600, mt: 4, mb: 2 }}>
            12. Termination
          </Typography>
          <Typography variant="body1" paragraph>
            We reserve the right to suspend or terminate your access to The Career Quill at any time, with or without notice, for any reason, including but not limited to:
          </Typography>
          <Box component="ul" sx={{ pl: 4, mb: 2 }}>
            <li>
              <Typography variant="body1" paragraph>
                Violation of these Terms.
              </Typography>
            </li>
            <li>
              <Typography variant="body1" paragraph>
                Fraudulent, abusive, or illegal activity.
              </Typography>
            </li>
            <li>
              <Typography variant="body1" paragraph>
                Extended periods of inactivity.
              </Typography>
            </li>
          </Box>
          <Typography variant="body1" paragraph>
            You may stop using The Career Quill at any time. Since your data is stored locally, you can delete it by clearing your browser&apos;s local storage. Upon termination, all provisions of these Terms that by their nature should survive termination shall survive, including ownership provisions, warranty disclaimers, and limitations of liability.
          </Typography>
        </Box>

        <Box component="section" sx={{ mb: 4 }}>
          <Typography variant="h2" component="h2" gutterBottom sx={{ fontSize: '1.75rem', fontWeight: 600, mt: 4, mb: 2 }}>
            13. Governing Law and Disputes
          </Typography>
          <Typography variant="body1" paragraph>
            These Terms shall be governed by and construed in accordance with the laws of the jurisdiction in which The Career Quill operates, without regard to its conflict of law provisions.
          </Typography>
          <Typography variant="body1" paragraph>
            Any disputes arising from or relating to these Terms or your use of The Career Quill shall be resolved through good faith negotiation. If a dispute cannot be resolved through negotiation, it shall be subject to the exclusive jurisdiction of the courts in the applicable jurisdiction.
          </Typography>
        </Box>

        <Box component="section" sx={{ mb: 4 }}>
          <Typography variant="h2" component="h2" gutterBottom sx={{ fontSize: '1.75rem', fontWeight: 600, mt: 4, mb: 2 }}>
            14. Severability
          </Typography>
          <Typography variant="body1" paragraph>
            If any provision of these Terms is found to be invalid, illegal, or unenforceable, the remaining provisions shall continue in full force and effect. The invalid or unenforceable provision shall be modified to the minimum extent necessary to make it valid and enforceable while preserving its intent.
          </Typography>
        </Box>

        <Box component="section" sx={{ mb: 4 }}>
          <Typography variant="h2" component="h2" gutterBottom sx={{ fontSize: '1.75rem', fontWeight: 600, mt: 4, mb: 2 }}>
            15. Entire Agreement
          </Typography>
          <Typography variant="body1" paragraph>
            These Terms, together with our Privacy Policy, constitute the entire agreement between you and The Career Quill regarding the use of our service and supersede all prior and contemporaneous agreements, proposals, or representations, whether written or oral.
          </Typography>
        </Box>

        <Box component="section" sx={{ mb: 4 }}>
          <Typography variant="h2" component="h2" gutterBottom sx={{ fontSize: '1.75rem', fontWeight: 600, mt: 4, mb: 2 }}>
            16. Contact Information
          </Typography>
          <Typography variant="body1" paragraph>
            If you have any questions about these Terms of Service, please contact us at:
          </Typography>
          <Typography variant="body1" paragraph>
            Email:{' '}
            <MuiLink href="mailto:dev@jpbranski.com" underline="hover">
              dev@jpbranski.com
            </MuiLink>
          </Typography>
        </Box>

        <Box
          sx={{
            mt: 6,
            p: 3,
            backgroundColor: 'background.default',
            borderRadius: 2,
            borderLeft: '4px solid',
            borderColor: 'warning.main',
          }}
        >
          <Typography variant="body2" color="text.secondary">
            <strong>Legal Disclaimer:</strong> These Terms of Service are provided as a general template and do not constitute legal advice. They may not address all legal requirements for your specific jurisdiction or business model. It is strongly recommended that you consult with a qualified attorney to review and customize these terms to ensure compliance with applicable laws and to protect your specific interests.
          </Typography>
        </Box>
      </Box>
    </Container>
  );
}
