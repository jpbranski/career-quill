import React from 'react';
import { Resume } from '@/lib/resumeModel';
import { formatDateRange } from '@/lib/exportUtils';
import styles from '@/styles/resume.module.css';

interface TemplateProps {
  resume: Resume;
}

export default function CreativeTemplate({ resume }: TemplateProps) {
  return (
    <div className={styles.creativeTemplate}>
      <header className={styles.creativeHeader}>
        <h1 className={styles.creativeName}>{resume.contact.fullName || 'Your Name'}</h1>
        <div style={{ fontSize: '11pt', opacity: 0.95 }}>
          {resume.contact.email && <span>{resume.contact.email}</span>}
          {resume.contact.phone && <span> • {resume.contact.phone}</span>}
          {resume.contact.location && <span> • {resume.contact.location}</span>}
        </div>
      </header>

      {resume.summary && (
        <section className={styles.creativeSection}>
          <h2 className={styles.creativeSectionTitle}>About Me</h2>
          <p className={styles.summary}>{resume.summary}</p>
        </section>
      )}

      {resume.skills.length > 0 && (
        <section className={styles.creativeSection}>
          <h2 className={styles.creativeSectionTitle}>Skills</h2>
          <div className={styles.skillsList}>
            {resume.skills.map((skill, idx) => (
              <span key={idx} className={styles.skillTag}>{skill}</span>
            ))}
          </div>
        </section>
      )}

      {resume.experience.length > 0 && (
        <section className={styles.creativeSection}>
          <h2 className={styles.creativeSectionTitle}>Experience</h2>
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

      {resume.education.length > 0 && (
        <section className={styles.creativeSection}>
          <h2 className={styles.creativeSectionTitle}>Education</h2>
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
