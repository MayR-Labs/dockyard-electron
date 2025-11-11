export interface ProfileMetadata {
  id: string;
  name: string;
  createdAt: string;
  lastAccessed: string;
  dataPath: string;
}

export interface ProfilesConfig {
  profiles: ProfileMetadata[];
  defaultProfile: string;
  lastActiveProfile: string;
}
