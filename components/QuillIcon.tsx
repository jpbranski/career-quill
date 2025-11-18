'use client';

import React from 'react';

interface QuillIconProps {
  size?: number;
  color?: string;
  className?: string;
}

export default function QuillIcon({
  size = 32,
  color = 'currentColor',
  className = ''
}: QuillIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Classic quill feather design with copper accent */}
      <path
        d="M20.24 3.17C19.13 2.46 17.89 2 16.5 2c-1.84 0-3.5.71-4.76 1.86C10.48 2.71 8.82 2 6.98 2c-1.39 0-2.63.46-3.74 1.17-.38.24-.49.74-.25 1.12.24.38.74.49 1.12.25C5.01 3.92 5.97 3.5 6.98 3.5c1.53 0 2.91.59 3.95 1.55L8.5 7.5 7 9l-2 2c-.39.39-.39 1.02 0 1.41.2.2.45.29.71.29.26 0 .51-.1.71-.29l2-2 1.5-1.5 2.43-2.45c1.04-.96 2.42-1.55 3.95-1.55 1.01 0 1.97.42 2.87 1.04.38.24.88.13 1.12-.25.24-.38.13-.88-.25-1.12z"
        fill="#C87E42"
      />
      <path
        d="M7 9l-2 2v9c0 .55.45 1 1 1h2c.55 0 1-.45 1-1v-9L7 9z"
        fill="currentColor"
        opacity="0.8"
      />
      <path
        d="M8.5 7.5L10.93 5.05c.5.52.92 1.12 1.24 1.77L8.5 10.5 7 9l1.5-1.5z"
        fill="currentColor"
        opacity="0.6"
      />
    </svg>
  );
}
