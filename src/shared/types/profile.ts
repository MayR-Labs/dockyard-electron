export interface ProfileMetadata {
  id: string;
  name: string;
  createdAt: string;
  lastAccessed: string;
  dataPath: string;
}

export interface ProfilesConfig extends Record<string, unknown> {
  profiles: ProfileMetadata[];
  defaultProfile: string;
  lastActiveProfile: string;
}
