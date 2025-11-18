import React from 'react';
import { Resume } from '@/lib/resumeModel';
import { formatDateRange } from '@/lib/exportUtils';
import styles from '@/styles/resume.module.css';

interface TemplateProps {
  resume: Resume;
}

export default function CleanTemplate({ resume }: TemplateProps) {
  const visibleSections = resume.sections
    .filter((s) => s.visible)
    .sort((a, b) => a.order - b.order);

  return (
    <div className={styles.cleanTemplate}>
      {/* Header - Contact Information */}
      <header className={styles.cleanHeader}>
        <h1 className={styles.cleanName}>
          {resume.contact.fullName || 'Your Name'}
        </h1>
        <div className={styles.cleanContact}>
          {resume.contact.email && <span>{resume.contact.email}</span>}
          {resume.contact.phone && <span>•</span>}
          {resume.contact.phone && <span>{resume.contact.phone}</span>}
          {resume.contact.location && <span>•</span>}
          {resume.contact.location && <span>{resume.contact.location}</span>}
        </div>
        {(resume.contact.linkedin || resume.contact.website || resume.contact.github) && (
          <div className={styles.cleanContact} style={{ marginTop: '0.25rem' }}>
            {resume.contact.linkedin && <span>{resume.contact.linkedin}</span>}
            {resume.contact.website && <span>•</span>}
            {resume.contact.website && <span>{resume.contact.website}</span>}
            {resume.contact.github && <span>•</span>}
            {resume.contact.github && <span>{resume.contact.github}</span>}
          </div>
        )}
      </header>

      {/* Render sections in order */}
      {visibleSections.map((section) => {
        switch (section.type) {
          case 'summary':
            return resume.summary ? (
              <section key={section.id} className={styles.cleanSection}>
                <h2 className={styles.cleanSectionTitle}>{section.title}</h2>
                <p className={styles.summary}>{resume.summary}</p>
              </section>
            ) : null;

          case 'skills':
            return resume.skills.length > 0 ? (
              <section key={section.id} className={styles.cleanSection}>
                <h2 className={styles.cleanSectionTitle}>{section.title}</h2>
                <div className={styles.skillsList}>
                  {resume.skills.map((skill, idx) => (
                    <span key={idx} className={styles.skillTag}>
                      {skill}
                    </span>
                  ))}
                </div>
              </section>
            ) : null;

          case 'experience':
            return resume.experience.length > 0 ? (
              <section key={section.id} className={styles.cleanSection}>
                <h2 className={styles.cleanSectionTitle}>{section.title}</h2>
                {resume.experience.map((exp) => (
                  <div key={exp.id} className={styles.experienceItem}>
                    <div className={styles.itemHeader}>
                      <div>
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
            ) : null;

          case 'education':
            return resume.education.length > 0 ? (
              <section key={section.id} className={styles.cleanSection}>
                <h2 className={styles.cleanSectionTitle}>{section.title}</h2>
                {resume.education.map((edu) => (
                  <div key={edu.id} className={styles.educationItem}>
                    <div className={styles.itemHeader}>
                      <div>
                        <div className={styles.itemTitle}>
                          {edu.degree} in {edu.field}
                        </div>
                        <div className={styles.itemSubtitle}>
                          {edu.institution} • {edu.location}
                        </div>
                      </div>
                      <div className={styles.itemDate}>
                        {formatDateRange(edu.startDate, edu.endDate, false)}
                      </div>
                    </div>
                    {(edu.gpa || edu.honors) && (
                      <div style={{ marginTop: '0.25rem', fontSize: '10pt' }}>
                        {edu.gpa && <div>GPA: {edu.gpa}</div>}
                        {edu.honors && <div>{edu.honors}</div>}
                      </div>
                    )}
                  </div>
                ))}
              </section>
            ) : null;

          case 'projects':
            return resume.projects.length > 0 ? (
              <section key={section.id} className={styles.cleanSection}>
                <h2 className={styles.cleanSectionTitle}>{section.title}</h2>
                {resume.projects.map((proj) => (
                  <div key={proj.id} className={styles.projectItem}>
                    <div className={styles.itemTitle}>{proj.name}</div>
                    {proj.description && (
                      <div className={styles.itemSubtitle}>{proj.description}</div>
                    )}
                    {proj.technologies.length > 0 && (
                      <div style={{ fontSize: '9pt', color: '#666', marginTop: '0.25rem' }}>
                        <strong>Technologies:</strong> {proj.technologies.join(', ')}
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
            ) : null;

          default:
            return null;
        }
      })}
    </div>
  );
}
