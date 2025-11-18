import React from 'react';
import { Resume } from '@/lib/resumeModel';
import { formatDateRange } from '@/lib/exportUtils';
import styles from '@/styles/resume.module.css';

interface TemplateProps {
  resume: Resume;
}

export default function AcademicTemplate({ resume }: TemplateProps) {
  return (
    <div className={styles.academicTemplate}>
      <header className={styles.academicHeader}>
        <h1 className={styles.academicName}>{resume.contact.fullName || 'Your Name'}</h1>
        <div style={{ fontSize: '10pt' }}>
          {resume.contact.email} • {resume.contact.phone}
          {resume.contact.location && ` • ${resume.contact.location}`}
        </div>
      </header>

      {resume.education.length > 0 && (
        <section className={styles.academicSection}>
          <h2 className={styles.academicSectionTitle}>Education</h2>
          {resume.education.map((edu) => (
            <div key={edu.id} className={styles.educationItem}>
              <div className={styles.itemHeader}>
                <div>
                  <div className={styles.itemTitle}>{edu.degree} in {edu.field}</div>
                  <div className={styles.itemSubtitle}>{edu.institution}, {edu.location}</div>
                </div>
                <div className={styles.itemDate}>
                  {formatDateRange(edu.startDate, edu.endDate, false)}
                </div>
              </div>
              {(edu.gpa || edu.honors) && (
                <div style={{ marginTop: '0.25rem', fontSize: '10pt' }}>
                  {edu.gpa && <div>GPA: {edu.gpa}</div>}
                  {edu.honors && <div><em>{edu.honors}</em></div>}
                </div>
              )}
            </div>
          ))}
        </section>
      )}

      {resume.experience.length > 0 && (
        <section className={styles.academicSection}>
          <h2 className={styles.academicSectionTitle}>Research & Experience</h2>
          {resume.experience.map((exp) => (
            <div key={exp.id} className={styles.experienceItem}>
              <div className={styles.itemHeader}>
                <div>
                  <div className={styles.itemTitle}>{exp.position}</div>
                  <div className={styles.itemSubtitle}>{exp.company}, {exp.location}</div>
                </div>
                <div className={styles.itemDate}>
                  {formatDateRange(exp.startDate, exp.endDate, exp.current)}
                </div>
              </div>
              {exp.bullets.length > 0 && (
                <ul className={styles.bulletList}>
                  {exp.bullets.map((bullet, idx) => (
                    <li key={idx} className={styles.bulletItem}>{bullet}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </section>
      )}

      {resume.projects.length > 0 && (
        <section className={styles.academicSection}>
          <h2 className={styles.academicSectionTitle}>Publications & Projects</h2>
          {resume.projects.map((proj) => (
            <div key={proj.id} className={styles.projectItem}>
              <div className={styles.itemTitle}>{proj.name}</div>
              {proj.description && <div style={{ fontStyle: 'italic', marginTop: '0.25rem' }}>{proj.description}</div>}
            </div>
          ))}
        </section>
      )}

      {resume.skills.length > 0 && (
        <section className={styles.academicSection}>
          <h2 className={styles.academicSectionTitle}>Skills & Competencies</h2>
          <div>{resume.skills.join(' • ')}</div>
        </section>
      )}
    </div>
  );
}
