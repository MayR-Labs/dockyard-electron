/**
 * Favicon Utility
 * Handles fetching and generating icons for apps
 * Single Responsibility: Icon management
 */

/**
 * Generate a favicon URL from a given website URL
 * Uses Google's favicon service as a reliable fallback
 */
export function getFaviconUrl(url: string): string {
  try {
    const urlObj = new URL(url);
    const domain = urlObj.hostname;
    
    // Use Google's favicon service which is reliable and fast
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
  } catch {
    // If URL parsing fails, return a default icon
    return '';
  }
}

/**
 * Generate a color-coded initial avatar for apps without icons
 * @param name - App name to generate avatar from
 * @returns Object with letter and color
 */
export function generateAppAvatar(name: string): { letter: string; color: string } {
  const letter = name.charAt(0).toUpperCase();
  
  // Generate consistent color based on first letter
  const colors = [
    'bg-indigo-600',
    'bg-purple-600',
    'bg-pink-600',
    'bg-red-600',
    'bg-orange-600',
    'bg-yellow-600',
    'bg-green-600',
    'bg-teal-600',
    'bg-cyan-600',
    'bg-blue-600',
  ];
  
  const index = letter.charCodeAt(0) % colors.length;
  return {
    letter,
    color: colors[index],
  };
}

/**
 * Download favicon from URL and convert to data URL
 * This allows offline usage of favicons
 */
export async function downloadFavicon(url: string): Promise<string | null> {
  try {
    const faviconUrl = getFaviconUrl(url);
    const response = await fetch(faviconUrl);
    
    if (!response.ok) {
      return null;
    }
    
    const blob = await response.blob();
    
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error('Failed to download favicon:', error);
    return null;
  }
}

/**
 * Validate if an icon URL is accessible
 */
export async function validateIconUrl(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch {
    return false;
  }
}
