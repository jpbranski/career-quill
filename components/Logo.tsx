'use client';

import React from 'react';
import Image from 'next/image';

interface LogoProps {
  size?: number;
  className?: string;
}

export default function Logo({
  size = 32,
  className = ''
}: LogoProps) {
  return (
    <Image
      src="/images/logo.webp"
      alt="Career Quill Logo"
      width={size}
      height={size}
      className={className}
      priority
      style={{
        width: size,
        height: size,
        objectFit: 'contain',
      }}
    />
  );
}
