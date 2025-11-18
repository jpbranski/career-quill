import React from 'react';
import { Resume } from '@/lib/resumeModel';
import { formatDateRange } from '@/lib/exportUtils';
import styles from '@/styles/resume.module.css';

interface TemplateProps {
  resume: Resume;
}

export default function CompactTemplate({ resume }: TemplateProps) {
  return (
    <div className={styles.compactTemplate}>
      <header className={styles.compactHeader}>
        <h1 className={styles.compactName}>{resume.contact.fullName || 'Your Name'}</h1>
        <div style={{ fontSize: '9pt', color: '#666' }}>
          {resume.contact.email && <span>{resume.contact.email}</span>}
          {resume.contact.phone && <span> • {resume.contact.phone}</span>}
          {resume.contact.location && <span> • {resume.contact.location}</span>}
        </div>
      </header>

      {resume.summary && (
        <section className={styles.compactSection}>
          <h2 className={styles.compactSectionTitle}>Summary</h2>
          <p className={styles.summary}>{resume.summary}</p>
        </section>
      )}

      {resume.skills.length > 0 && (
        <section className={styles.compactSection}>
          <h2 className={styles.compactSectionTitle}>Skills</h2>
          <div style={{ fontSize: '9pt' }}>{resume.skills.join(' • ')}</div>
        </section>
      )}

      {resume.experience.length > 0 && (
        <section className={styles.compactSection}>
          <h2 className={styles.compactSectionTitle}>Experience</h2>
          {resume.experience.map((exp) => (
            <div key={exp.id} style={{ marginBottom: '0.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
                <span>{exp.position} - {exp.company}</span>
                <span style={{ fontSize: '9pt', fontWeight: 400, fontStyle: 'italic' }}>
                  {formatDateRange(exp.startDate, exp.endDate, exp.current)}
                </span>
              </div>
              {exp.bullets.length > 0 && (
                <ul style={{ margin: '0.25rem 0', paddingLeft: '1.25rem', fontSize: '9pt' }}>
                  {exp.bullets.map((bullet, idx) => (
                    <li key={idx} style={{ marginBottom: '0.2rem' }}>{bullet}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </section>
      )}

      {resume.education.length > 0 && (
        <section className={styles.compactSection}>
          <h2 className={styles.compactSectionTitle}>Education</h2>
          {resume.education.map((edu) => (
            <div key={edu.id} style={{ marginBottom: '0.5rem' }}>
              <div style={{ fontWeight: 700 }}>
                {edu.degree} in {edu.field} - {edu.institution}
              </div>
              <div style={{ fontSize: '9pt', color: '#666' }}>
                {formatDateRange(edu.startDate, edu.endDate, false)}
                {edu.gpa && ` • GPA: ${edu.gpa}`}
              </div>
            </div>
          ))}
        </section>
      )}
    </div>
  );
}
