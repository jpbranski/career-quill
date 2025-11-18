import React from 'react';
import { Resume } from '@/lib/resumeModel';
import { formatDateRange } from '@/lib/exportUtils';
import styles from '@/styles/resume.module.css';

interface TemplateProps {
  resume: Resume;
}

export default function TechnicalTemplate({ resume }: TemplateProps) {
  return (
    <div className={styles.technicalTemplate}>
      <header className={styles.technicalHeader}>
        <h1 className={styles.technicalName}>{resume.contact.fullName || 'Your Name'}</h1>
        <div style={{ fontSize: '10pt', color: '#666', marginTop: '0.25rem' }}>
          {resume.contact.email} | {resume.contact.phone} | {resume.contact.location}
        </div>
        {(resume.contact.linkedin || resume.contact.github || resume.contact.website) && (
          <div style={{ fontSize: '9pt', color: '#666', marginTop: '0.25rem' }}>
            {resume.contact.linkedin && <span>{resume.contact.linkedin}</span>}
            {resume.contact.github && <span> | {resume.contact.github}</span>}
            {resume.contact.website && <span> | {resume.contact.website}</span>}
          </div>
        )}
      </header>

      {resume.summary && (
        <section className={styles.technicalSection}>
          <h2 className={styles.technicalSectionTitle}>// SUMMARY</h2>
          <p className={styles.summary}>{resume.summary}</p>
        </section>
      )}

      {resume.skills.length > 0 && (
        <section className={styles.technicalSection}>
          <h2 className={styles.technicalSectionTitle}>// TECHNICAL SKILLS</h2>
          <div className={styles.skillsList}>
            {resume.skills.map((skill, idx) => (
              <span key={idx} className={styles.skillTag}>{skill}</span>
            ))}
          </div>
        </section>
      )}

      {resume.experience.length > 0 && (
        <section className={styles.technicalSection}>
          <h2 className={styles.technicalSectionTitle}>// EXPERIENCE</h2>
          {resume.experience.map((exp) => (
            <div key={exp.id} className={styles.experienceItem}>
              <div className={styles.itemHeader}>
                <div>
                  <div className={styles.itemTitle}>{exp.position}</div>
                  <div className={styles.itemSubtitle}>{exp.company} • {exp.location}</div>
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
        <section className={styles.technicalSection}>
          <h2 className={styles.technicalSectionTitle}>// PROJECTS</h2>
          {resume.projects.map((proj) => (
            <div key={proj.id} className={styles.projectItem}>
              <div className={styles.itemTitle}>{proj.name}</div>
              {proj.technologies.length > 0 && (
                <div style={{ fontSize: '9pt', color: '#666', marginTop: '0.25rem' }}>
                  <strong>Stack:</strong> {proj.technologies.join(', ')}
                </div>
              )}
              {proj.bullets.length > 0 && (
                <ul className={styles.bulletList}>
                  {proj.bullets.map((bullet, idx) => (
                    <li key={idx} className={styles.bulletItem}>{bullet}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </section>
      )}

      {resume.education.length > 0 && (
        <section className={styles.technicalSection}>
          <h2 className={styles.technicalSectionTitle}>// EDUCATION</h2>
          {resume.education.map((edu) => (
            <div key={edu.id} className={styles.educationItem}>
              <div className={styles.itemHeader}>
                <div>
                  <div className={styles.itemTitle}>{edu.degree} in {edu.field}</div>
                  <div className={styles.itemSubtitle}>{edu.institution}</div>
                </div>
                <div className={styles.itemDate}>
                  {formatDateRange(edu.startDate, edu.endDate, false)}
                </div>
              </div>
            </div>
          ))}
        </section>
      )}
    </div>
  );
}
