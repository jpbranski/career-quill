'use client';

import React, { forwardRef } from 'react';
import { Resume } from '@/lib/resumeModel';
import CleanTemplate from './CleanTemplate';
import ModernTemplate from './ModernTemplate';
import CompactTemplate from './CompactTemplate';
import CreativeTemplate from './CreativeTemplate';
import AcademicTemplate from './AcademicTemplate';
import TechnicalTemplate from './TechnicalTemplate';

interface ResumePreviewProps {
  resume: Resume;
  className?: string;
}

const ResumePreview = forwardRef<HTMLDivElement, ResumePreviewProps>(
  ({ resume, className }, ref) => {
    const renderTemplate = () => {
      switch (resume.template) {
        case 'modern':
          return <ModernTemplate resume={resume} />;
        case 'compact':
          return <CompactTemplate resume={resume} />;
        case 'creative':
          return <CreativeTemplate resume={resume} />;
        case 'academic':
          return <AcademicTemplate resume={resume} />;
        case 'technical':
          return <TechnicalTemplate resume={resume} />;
        case 'clean':
        default:
          return <CleanTemplate resume={resume} />;
      }
    };

    return (
      <div ref={ref} className={className}>
        {renderTemplate()}
      </div>
    );
  }
);

ResumePreview.displayName = 'ResumePreview';

export default ResumePreview;
