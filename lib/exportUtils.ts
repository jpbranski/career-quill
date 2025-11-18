import { Resume, Experience, Education, Project } from './resumeModel';
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  UnderlineType,
} from 'docx';

/**
 * Export resume as plain text
 */
export function exportAsTxt(resume: Resume): void {
  let text = '';

  // Contact Information
  text += `${resume.contact.fullName}\n`;
  if (resume.contact.email) text += `${resume.contact.email} | `;
  if (resume.contact.phone) text += `${resume.contact.phone} | `;
  if (resume.contact.location) text += `${resume.contact.location}`;
  text += '\n';

  if (resume.contact.linkedin || resume.contact.website || resume.contact.github) {
    if (resume.contact.linkedin) text += `LinkedIn: ${resume.contact.linkedin} | `;
    if (resume.contact.website) text += `Website: ${resume.contact.website} | `;
    if (resume.contact.github) text += `GitHub: ${resume.contact.github}`;
    text += '\n';
  }

  text += '\n' + '='.repeat(80) + '\n\n';

  // Summary
  if (resume.summary) {
    text += 'PROFESSIONAL SUMMARY\n';
    text += '-'.repeat(80) + '\n';
    text += `${resume.summary}\n\n`;
  }

  // Skills
  if (resume.skills.length > 0) {
    text += 'SKILLS\n';
    text += '-'.repeat(80) + '\n';
    text += resume.skills.join(' • ') + '\n\n';
  }

  // Experience
  if (resume.experience.length > 0) {
    text += 'EXPERIENCE\n';
    text += '-'.repeat(80) + '\n';
    resume.experience.forEach((exp) => {
      text += formatExperienceText(exp);
    });
  }

  // Education
  if (resume.education.length > 0) {
    text += 'EDUCATION\n';
    text += '-'.repeat(80) + '\n';
    resume.education.forEach((edu) => {
      text += formatEducationText(edu);
    });
  }

  // Projects
  if (resume.projects.length > 0) {
    text += 'PROJECTS\n';
    text += '-'.repeat(80) + '\n';
    resume.projects.forEach((proj) => {
      text += formatProjectText(proj);
    });
  }

  // Create and download the file
  const blob = new Blob([text], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${resume.contact.fullName.replace(/\s+/g, '-') || 'resume'}.txt`;
  link.click();
  URL.revokeObjectURL(url);
}

/**
 * Export resume as DOCX
 */
export async function exportAsDocx(resume: Resume): Promise<void> {
  const sections: Paragraph[] = [];

  // Header - Contact Info
  sections.push(
    new Paragraph({
      text: resume.contact.fullName,
      heading: HeadingLevel.TITLE,
      alignment: AlignmentType.CENTER,
    })
  );

  const contactDetails = [];
  if (resume.contact.email) contactDetails.push(resume.contact.email);
  if (resume.contact.phone) contactDetails.push(resume.contact.phone);
  if (resume.contact.location) contactDetails.push(resume.contact.location);

  sections.push(
    new Paragraph({
      text: contactDetails.join(' | '),
      alignment: AlignmentType.CENTER,
    })
  );

  const links = [];
  if (resume.contact.linkedin) links.push(`LinkedIn: ${resume.contact.linkedin}`);
  if (resume.contact.website) links.push(`Website: ${resume.contact.website}`);
  if (resume.contact.github) links.push(`GitHub: ${resume.contact.github}`);

  if (links.length > 0) {
    sections.push(
      new Paragraph({
        text: links.join(' | '),
        alignment: AlignmentType.CENTER,
      })
    );
  }

  sections.push(new Paragraph({ text: '' })); // Spacing

  // Summary
  if (resume.summary) {
    sections.push(
      new Paragraph({
        text: 'PROFESSIONAL SUMMARY',
        heading: HeadingLevel.HEADING_1,
      })
    );
    sections.push(
      new Paragraph({
        text: resume.summary,
      })
    );
    sections.push(new Paragraph({ text: '' }));
  }

  // Skills
  if (resume.skills.length > 0) {
    sections.push(
      new Paragraph({
        text: 'SKILLS',
        heading: HeadingLevel.HEADING_1,
      })
    );
    sections.push(
      new Paragraph({
        text: resume.skills.join(' • '),
      })
    );
    sections.push(new Paragraph({ text: '' }));
  }

  // Experience
  if (resume.experience.length > 0) {
    sections.push(
      new Paragraph({
        text: 'EXPERIENCE',
        heading: HeadingLevel.HEADING_1,
      })
    );

    resume.experience.forEach((exp, index) => {
      sections.push(
        new Paragraph({
          children: [
            new TextRun({
              text: exp.position,
              bold: true,
            }),
          ],
        })
      );
      sections.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `${exp.company} | ${exp.location}`,
              italics: true,
            }),
          ],
        })
      );
      sections.push(
        new Paragraph({
          text: formatDateRange(exp.startDate, exp.endDate, exp.current),
          italics: true,
        })
      );

      exp.bullets.forEach((bullet) => {
        sections.push(
          new Paragraph({
            text: bullet,
            bullet: { level: 0 },
          })
        );
      });

      if (index < resume.experience.length - 1) {
        sections.push(new Paragraph({ text: '' }));
      }
    });

    sections.push(new Paragraph({ text: '' }));
  }

  // Education
  if (resume.education.length > 0) {
    sections.push(
      new Paragraph({
        text: 'EDUCATION',
        heading: HeadingLevel.HEADING_1,
      })
    );

    resume.education.forEach((edu) => {
      sections.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `${edu.degree} in ${edu.field}`,
              bold: true,
            }),
          ],
        })
      );
      sections.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `${edu.institution} | ${edu.location}`,
              italics: true,
            }),
          ],
        })
      );
      sections.push(
        new Paragraph({
          text: formatDateRange(edu.startDate, edu.endDate, false),
          italics: true,
        })
      );
      if (edu.gpa) {
        sections.push(
          new Paragraph({
            text: `GPA: ${edu.gpa}`,
          })
        );
      }
      if (edu.honors) {
        sections.push(
          new Paragraph({
            text: edu.honors,
          })
        );
      }
      sections.push(new Paragraph({ text: '' }));
    });
  }

  // Projects
  if (resume.projects.length > 0) {
    sections.push(
      new Paragraph({
        text: 'PROJECTS',
        heading: HeadingLevel.HEADING_1,
      })
    );

    resume.projects.forEach((proj) => {
      sections.push(
        new Paragraph({
          children: [
            new TextRun({
              text: proj.name,
              bold: true,
            }),
          ],
        })
      );
      if (proj.description) {
        sections.push(
          new Paragraph({
            text: proj.description,
            italics: true,
          })
        );
      }
      if (proj.technologies.length > 0) {
        sections.push(
          new Paragraph({
            text: `Technologies: ${proj.technologies.join(', ')}`,
          })
        );
      }
      proj.bullets.forEach((bullet) => {
        sections.push(
          new Paragraph({
            text: bullet,
            bullet: { level: 0 },
          })
        );
      });
      sections.push(new Paragraph({ text: '' }));
    });
  }

  // Create document
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: sections,
      },
    ],
  });

  // Generate and download
  const blob = await Packer.toBlob(doc);
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${resume.contact.fullName.replace(/\s+/g, '-') || 'resume'}.docx`;
  link.click();
  URL.revokeObjectURL(url);
}

/**
 * Helper function to format experience for text export
 */
function formatExperienceText(exp: Experience): string {
  let text = `${exp.position}\n`;
  text += `${exp.company} | ${exp.location}\n`;
  text += `${formatDateRange(exp.startDate, exp.endDate, exp.current)}\n`;
  exp.bullets.forEach((bullet) => {
    text += `  • ${bullet}\n`;
  });
  text += '\n';
  return text;
}

/**
 * Helper function to format education for text export
 */
function formatEducationText(edu: Education): string {
  let text = `${edu.degree} in ${edu.field}\n`;
  text += `${edu.institution} | ${edu.location}\n`;
  text += `${formatDateRange(edu.startDate, edu.endDate, false)}\n`;
  if (edu.gpa) text += `GPA: ${edu.gpa}\n`;
  if (edu.honors) text += `${edu.honors}\n`;
  text += '\n';
  return text;
}

/**
 * Helper function to format project for text export
 */
function formatProjectText(proj: Project): string {
  let text = `${proj.name}\n`;
  if (proj.description) text += `${proj.description}\n`;
  if (proj.technologies.length > 0) {
    text += `Technologies: ${proj.technologies.join(', ')}\n`;
  }
  proj.bullets.forEach((bullet) => {
    text += `  • ${bullet}\n`;
  });
  text += '\n';
  return text;
}

/**
 * Helper function to format date ranges
 */
export function formatDateRange(startDate: string, endDate: string, current: boolean): string {
  const start = startDate ? formatDate(startDate) : '';
  const end = current ? 'Present' : endDate ? formatDate(endDate) : '';
  return `${start} - ${end}`;
}

/**
 * Helper function to format a single date
 */
function formatDate(date: string): string {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
}
