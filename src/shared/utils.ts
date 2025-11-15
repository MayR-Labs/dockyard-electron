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
 * Generate a slug from a string
 * Converts to lowercase, removes special characters, replaces spaces with hyphens
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
}

/**
 * Get partition name for an app with slugs
 * Format: persist:{profileSlug}-{workspaceSlug}-{appSlug}-{instanceId}
 */
export function getPartitionName(
  appId: string,
  appName: string,
  instanceId: string,
  workspaceId: string,
  workspaceName: string,
  profileId: string,
  profileName: string,
  sessionMode?: 'isolated' | 'shared'
): string {
  const profileSlug = generateSlug(profileName) || profileId;
  const workspaceSlug = generateSlug(workspaceName) || workspaceId;
  const appSlug = generateSlug(appName) || appId;

  if (sessionMode === 'shared') {
    // Shared session: all apps in workspace share the same partition
    return `persist:${profileSlug}-${workspaceSlug}-shared`;
  }
  
  // Isolated session: unique partition per app instance
  return `persist:${profileSlug}-${workspaceSlug}-${appSlug}-${instanceId}`;
}
