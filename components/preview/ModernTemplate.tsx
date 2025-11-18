import React from 'react';
import { Resume } from '@/lib/resumeModel';
import { formatDateRange } from '@/lib/exportUtils';
import styles from '@/styles/resume.module.css';

interface TemplateProps {
  resume: Resume;
}

export default function ModernTemplate({ resume }: TemplateProps) {
  const visibleSections = resume.sections
    .filter((s) => s.visible)
    .sort((a, b) => a.order - b.order);

  return (
    <div className={styles.modernTemplate}>
      {/* Sidebar */}
      <aside className={styles.modernSidebar}>
        <div>
          <h1 className={styles.modernName}>
            {resume.contact.fullName || 'Your Name'}
          </h1>
          {resume.contact.email && (
            <div className={styles.modernTitle}>{resume.contact.email.split('@')[0]}</div>
          )}
        </div>

        {/* Contact Section */}
        <div className={styles.modernSidebarSection}>
          <h2 className={styles.modernSidebarTitle}>Contact</h2>
          <div style={{ fontSize: '9pt', lineHeight: 1.6 }}>
            {resume.contact.email && <div>{resume.contact.email}</div>}
            {resume.contact.phone && <div>{resume.contact.phone}</div>}
            {resume.contact.location && <div>{resume.contact.location}</div>}
          </div>
        </div>

        {/* Links */}
        {(resume.contact.linkedin || resume.contact.website || resume.contact.github) && (
          <div className={styles.modernSidebarSection}>
            <h2 className={styles.modernSidebarTitle}>Links</h2>
            <div style={{ fontSize: '9pt', lineHeight: 1.6, wordBreak: 'break-word' }}>
              {resume.contact.linkedin && <div>{resume.contact.linkedin}</div>}
              {resume.contact.website && <div>{resume.contact.website}</div>}
              {resume.contact.github && <div>{resume.contact.github}</div>}
            </div>
          </div>
        )}

        {/* Skills in Sidebar */}
        {resume.skills.length > 0 && (
          <div className={styles.modernSidebarSection}>
            <h2 className={styles.modernSidebarTitle}>Skills</h2>
            <div style={{ fontSize: '9pt', lineHeight: 1.6 }}>
              {resume.skills.map((skill, idx) => (
                <div key={idx} style={{ marginBottom: '0.25rem' }}>
                  • {skill}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education in Sidebar */}
        {resume.education.length > 0 && (
          <div className={styles.modernSidebarSection}>
            <h2 className={styles.modernSidebarTitle}>Education</h2>
            {resume.education.map((edu) => (
              <div key={edu.id} style={{ marginBottom: '1rem', fontSize: '9pt', lineHeight: 1.4 }}>
                <div style={{ fontWeight: 700, marginBottom: '0.25rem' }}>
                  {edu.degree}
                </div>
                <div style={{ color: '#AEB1BA' }}>{edu.field}</div>
                <div style={{ color: '#AEB1BA', marginTop: '0.25rem' }}>
                  {edu.institution}
                </div>
                <div style={{ color: '#AEB1BA', fontSize: '8pt', marginTop: '0.25rem' }}>
                  {formatDateRange(edu.startDate, edu.endDate, false)}
                </div>
                {edu.gpa && (
                  <div style={{ marginTop: '0.25rem', color: '#E4B784' }}>
                    GPA: {edu.gpa}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </aside>

      {/* Main Content */}
      <main className={styles.modernMain}>
        {/* Summary */}
        {resume.summary && (
          <section className={styles.modernMainSection}>
            <h2 className={styles.modernMainTitle}>Profile</h2>
            <p className={styles.summary}>{resume.summary}</p>
          </section>
        )}

        {/* Experience */}
        {resume.experience.length > 0 && (
          <section className={styles.modernMainSection}>
            <h2 className={styles.modernMainTitle}>Experience</h2>
            {resume.experience.map((exp) => (
              <div key={exp.id} className={styles.experienceItem}>
                <div className={styles.itemHeader}>
                  <div style={{ flex: 1 }}>
                    <div className={styles.itemTitle}>{exp.position}</div>
                    <div className={styles.itemSubtitle}>
                      {exp.company} • {exp.location}
                    </div>
                  </div>
                  <div className={styles.itemDate}>
                    {formatDateRange(exp.startDate, exp.endDate, exp.current)}
                  </div>
                </div>
                {exp.bullets.length > 0 && (
                  <ul className={styles.bulletList}>
                    {exp.bullets.map((bullet, idx) => (
                      <li key={idx} className={styles.bulletItem}>
                        {bullet}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </section>
        )}

        {/* Projects */}
        {resume.projects.length > 0 && (
          <section className={styles.modernMainSection}>
            <h2 className={styles.modernMainTitle}>Projects</h2>
            {resume.projects.map((proj) => (
              <div key={proj.id} className={styles.projectItem}>
                <div className={styles.itemTitle}>{proj.name}</div>
                {proj.description && (
                  <div className={styles.itemSubtitle}>{proj.description}</div>
                )}
                {proj.technologies.length > 0 && (
                  <div style={{ fontSize: '9pt', color: '#666', marginTop: '0.25rem' }}>
                    <strong>Tech:</strong> {proj.technologies.join(', ')}
                  </div>
                )}
                {proj.bullets.length > 0 && (
                  <ul className={styles.bulletList}>
                    {proj.bullets.map((bullet, idx) => (
                      <li key={idx} className={styles.bulletItem}>
                        {bullet}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </section>
        )}
      </main>
    </div>
  );
}
