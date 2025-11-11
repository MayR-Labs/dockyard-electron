import { ProfileManager } from '../profile-manager';

describe('ProfileManager', () => {
  let profileManager;

  beforeEach(() => {
    // Create a new profile manager for each test
    profileManager = new ProfileManager('test-profile');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createProfile', () => {
    it('should create a new profile with default values', () => {
      const profile = profileManager.createProfile('new-test-profile');
      
      expect(profile).toBeDefined();
      expect(profile.name).toBe('new-test-profile');
      expect(profile.settings.notifications).toBe(true);
      expect(profile.settings.autoHibernate).toBe(true);
      expect(profile.workspaces).toEqual([]);
    });

    it('should set the created profile profile', () => {
      const profile = profileManager.createProfile('new-test-profile-2');
      
      expect(profileManager.getCurrentProfile()).toEqual(profile);
    });
  });

  describe('loadProfile', () => {
    it('should load an existing profile', () => {
      // First create a profile
      const createdProfile = profileManager.createProfile('existing-profile');
      
      // Then load it
      const profile = profileManager.loadProfile('existing-profile');
      
      expect(profile).toBeDefined();
      expect(profile.name).toBe('existing-profile');
      expect(profile.id).toBe(createdProfile.id);
      expect(profileManager.getCurrentProfile()).toEqual(profile);
    });

    it('should create a new profile if it does not exist', () => {
      const profile = profileManager.loadProfile('new-load-profile');
      
      expect(profile).toBeDefined();
      expect(profile.name).toBe('new-load-profile');
    });
  });

  describe('updateProfile', () => {
    it('should update an existing profile', () => {
      // Create a profile first
      const createdProfile = profileManager.createProfile('update-test-profile');
      
      const updates = { 
        settings: { 
          ...createdProfile.settings, 
          notifications: false 
        } 
      };
      const updatedProfile = profileManager.updateProfile(createdProfile.id, updates);
      
      expect(updatedProfile.settings.notifications).toBe(false);
      expect(updatedProfile.id).toBe(createdProfile.id);
    });

    it('should throw an error if profile does not exist', () => {
      expect(() => {
        profileManager.updateProfile('non-existent-id', {});
      }).toThrow('Profile with id non-existent-id not found');
    });
  });

  describe('deleteProfile', () => {
    it('should delete an existing profile', () => {
      // Create a profile first
      const createdProfile = profileManager.createProfile('delete-test-profile');
      
      // Delete it
      profileManager.deleteProfile(createdProfile.id);
      
      // Verify it's gone from the list
      const profiles = profileManager.listProfiles();
      const deletedProfile = profiles.find(p => p.id === createdProfile.id);
      expect(deletedProfile).toBeUndefined();
    });

    it('should throw an error if profile does not exist', () => {
      expect(() => {
        profileManager.deleteProfile('non-existent-id');
      }).toThrow('Profile with id non-existent-id not found');
    });

    it('should clear current profile if deleted', () => {
      // Create and load a profile
      const createdProfile = profileManager.createProfile('delete-current-profile');
      profileManager.loadProfile('delete-current-profile');
      
      // Delete it
      profileManager.deleteProfile(createdProfile.id);
      
      expect(profileManager.getCurrentProfile()).toBeNull();
    });
  });

  describe('listProfiles', () => {
    it('should return all profiles', () => {
      // Create multiple profiles
      profileManager.createProfile('list-profile-1');
      profileManager.createProfile('list-profile-2');
      
      const result = profileManager.listProfiles();
      
      expect(result.length).toBeGreaterThanOrEqual(2);
      const names = result.map(p => p.name);
      expect(names).toContain('list-profile-1');
      expect(names).toContain('list-profile-2');
    });

    it('should return empty array when no profiles exist', () => {
      // Fresh profile manager with no profiles created
      const result = profileManager.listProfiles();
      
      expect(result).toEqual([]);
    });
  });
});
