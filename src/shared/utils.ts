import { randomBytes } from 'crypto';

/**
 * Generate a unique ID
 */
export function generateId(): string {
  return randomBytes(16).toString('hex');
}

/**
 * Get current ISO timestamp
 */
export function getCurrentTimestamp(): string {
  return new Date().toISOString();
}

/**
 * Validate URL format
 */
export function isValidUrl(url: string): boolean {
  try {
    const parsedUrl = new URL(url);
    return parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * Sanitize profile name (remove invalid characters)
 */
export function sanitizeProfileName(name: string): string {
  return name.replace(/[^a-zA-Z0-9-_]/g, '-').toLowerCase();
}

/**
 * Get partition name for an app
 */
export function getPartitionName(
  appId: string,
  instanceId: string,
  workspaceId?: string,
  sessionMode?: 'isolated' | 'shared'
): string {
  if (sessionMode === 'shared' && workspaceId) {
    return `persist:workspace-${workspaceId}`;
  }
  return `persist:app-${appId}-${instanceId}`;
}
