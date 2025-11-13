/**
 * Base Icon Component
 * Provides consistent styling and behavior for all SVG icons
 * Single Responsibility: SVG wrapper with common properties
 */

import React from 'react';

export interface IconProps {
  className?: string;
  size?: number | string;
  strokeWidth?: number;
  onClick?: () => void;
  title?: string;
}

interface BaseIconProps extends IconProps {
  children: React.ReactNode;
  viewBox?: string;
}

export function Icon({
  className = '',
  size = 24,
  strokeWidth = 2,
  viewBox = '0 0 24 24',
  children,
  onClick,
  title,
}: BaseIconProps) {
  const sizeValue = typeof size === 'number' ? `${size}px` : size;

  return (
    <svg
      className={className}
      width={sizeValue}
      height={sizeValue}
      viewBox={viewBox}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      onClick={onClick}
      role={title ? 'img' : undefined}
      aria-label={title}
    >
      {title && <title>{title}</title>}
      {children}
    </svg>
  );
}
