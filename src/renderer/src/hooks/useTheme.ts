/**
 * Theme Hook
 * Manages theme mode detection and application
 */

import { useEffect, useState } from 'react';
import { ThemeMode, BackgroundStyle } from '../../../shared/types/settings';

interface UseThemeOptions {
  mode: ThemeMode;
  accentColor: string;
  backgroundStyle: BackgroundStyle;
}

export function useTheme({ mode, accentColor, backgroundStyle }: UseThemeOptions) {
  const [effectiveTheme, setEffectiveTheme] = useState<'light' | 'dark'>('dark');

  useEffect(() => {
    // Determine effective theme
    let theme: 'light' | 'dark' = 'dark';
    
    if (mode === 'system') {
      // Detect system preference
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      theme = isDark ? 'dark' : 'light';
    } else {
      theme = mode;
    }

    setEffectiveTheme(theme);

    // Apply theme class to body
    document.documentElement.classList.remove('theme-light', 'theme-dark');
    if (theme === 'light') {
      document.documentElement.classList.add('theme-light');
    } else {
      document.documentElement.classList.add('theme-dark');
    }

    // Apply background style
    document.body.classList.remove('bg-glass', 'bg-minimal');
    if (backgroundStyle === 'glass') {
      document.body.classList.add('bg-glass');
    } else if (backgroundStyle === 'minimal') {
      document.body.classList.add('bg-minimal');
    }

    // Apply accent color as CSS variable
    const hsl = hexToHSL(accentColor);
    if (hsl) {
      document.documentElement.style.setProperty('--primary', hsl);
      document.documentElement.style.setProperty('--accent', hsl);
      document.documentElement.style.setProperty('--ring', hsl);
      document.documentElement.style.setProperty('--sidebar-primary', hsl);
      document.documentElement.style.setProperty('--sidebar-ring', hsl);
    }
  }, [mode, accentColor, backgroundStyle]);

  useEffect(() => {
    // Listen for system theme changes when mode is 'system'
    if (mode !== 'system') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      const theme = e.matches ? 'dark' : 'light';
      setEffectiveTheme(theme);
      
      document.documentElement.classList.remove('theme-light', 'theme-dark');
      if (theme === 'light') {
        document.documentElement.classList.add('theme-light');
      } else {
        document.documentElement.classList.add('theme-dark');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [mode]);

  return effectiveTheme;
}

/**
 * Convert hex color to HSL format for CSS variables
 */
function hexToHSL(hex: string): string | null {
  // Remove # if present
  hex = hex.replace(/^#/, '');

  // Parse hex values
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }

  h = Math.round(h * 360);
  s = Math.round(s * 100);
  const lPercent = Math.round(l * 100);

  return `${h} ${s}% ${lPercent}%`;
}
