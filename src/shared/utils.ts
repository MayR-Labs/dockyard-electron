/**
 * Generate a unique ID
 * Browser and Node.js compatible version
 */
export function generateId(): string {
  // Use browser's crypto API if available, otherwise fallback
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  
  // Fallback: timestamp + random string
  return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
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
