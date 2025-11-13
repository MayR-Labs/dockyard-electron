/**
 * Device Presets Constants
 * Predefined screen sizes for responsive testing
 * Single Responsibility: Store device configuration data
 */

export interface DevicePreset {
  name: string;
  width: number;
  height: number;
  category: 'phone' | 'tablet' | 'desktop';
}

export const DEVICE_PRESETS: DevicePreset[] = [
  // Phones
  { name: 'iPhone SE', width: 375, height: 667, category: 'phone' },
  { name: 'iPhone 12/13', width: 390, height: 844, category: 'phone' },
  { name: 'iPhone 14 Pro Max', width: 430, height: 932, category: 'phone' },
  { name: 'Samsung Galaxy S21', width: 360, height: 800, category: 'phone' },
  { name: 'Google Pixel 5', width: 393, height: 851, category: 'phone' },

  // Tablets
  { name: 'iPad Mini', width: 768, height: 1024, category: 'tablet' },
  { name: 'iPad Air', width: 820, height: 1180, category: 'tablet' },
  { name: 'iPad Pro 11"', width: 834, height: 1194, category: 'tablet' },
  { name: 'iPad Pro 12.9"', width: 1024, height: 1366, category: 'tablet' },
  { name: 'Samsung Galaxy Tab', width: 800, height: 1280, category: 'tablet' },

  // Desktop
  { name: 'Laptop (1366x768)', width: 1366, height: 768, category: 'desktop' },
  { name: 'Desktop (1920x1080)', width: 1920, height: 1080, category: 'desktop' },
  { name: 'Desktop (2560x1440)', width: 2560, height: 1440, category: 'desktop' },
];

export const ZOOM_PRESETS = [0.5, 0.75, 1.0, 1.25, 1.5, 2.0];

export const ZOOM_LIMITS = {
  MIN: 0.5,
  MAX: 2.0,
  STEP: 0.1,
  DEFAULT: 1.0,
};
