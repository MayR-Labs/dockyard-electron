import { app, dialog } from 'electron';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import AdmZip from 'adm-zip';
import { debugLog, debugError } from '../../shared/utils/debug';

export class BackupService {
  private static readonly ALGORITHM = 'aes-256-gcm';
  private static readonly SALT_LENGTH = 64;
  private static readonly IV_LENGTH = 16;
  private static readonly TAG_LENGTH = 16;
  private static readonly ITERATIONS = 100000;
  private static readonly KEY_LENGTH = 32;

  /**
   * Derive a key from the password using PBKDF2
   */
  private static getKey(password: string, salt: Buffer): Buffer {
    return crypto.pbkdf2Sync(
      password,
      salt,
      BackupService.ITERATIONS,
      BackupService.KEY_LENGTH,
      'sha512'
    );
  }

  /**
   * Create a backup of the profiles and profiles.json
   */
  async createBackup(
    password: string
  ): Promise<{ success: boolean; filePath?: string; error?: string }> {
    try {
      const userDataPath = app.getPath('userData');
      const profilesDir = path.join(userDataPath, 'profiles');
      const profilesJson = path.join(userDataPath, 'profiles.json');

      if (!fs.existsSync(profilesDir) && !fs.existsSync(profilesJson)) {
        return { success: false, error: 'No data to backup found' };
      }

      // Create ZIP
      const zip = new AdmZip();
      if (fs.existsSync(profilesDir)) {
        zip.addLocalFolder(profilesDir, 'profiles');
      }
      if (fs.existsSync(profilesJson)) {
        zip.addLocalFile(profilesJson);
      }

      const zipBuffer = zip.toBuffer();

      // Encrypt
      const salt = crypto.randomBytes(BackupService.SALT_LENGTH);
      const iv = crypto.randomBytes(BackupService.IV_LENGTH);
      const key = BackupService.getKey(password, salt);

      const cipher = crypto.createCipheriv(BackupService.ALGORITHM, key, iv);
      const encrypted = Buffer.concat([cipher.update(zipBuffer), cipher.final()]);
      const tag = cipher.getAuthTag();

      // Combine: Salt + IV + Tag + EncryptedData
      const finalBuffer = Buffer.concat([salt, iv, tag, encrypted]);

      // Save Dialog
      const { filePath } = await dialog.showSaveDialog({
        title: 'Save Backup',
        defaultPath: `dockyard-backup-${new Date().toISOString().split('T')[0]}.dockyard`,
        filters: [{ name: 'Dockyard Backup', extensions: ['dockyard'] }],
      });

      if (!filePath) {
        return { success: false, error: 'Backup cancelled' };
      }

      fs.writeFileSync(filePath, finalBuffer);
      return { success: true, filePath };
    } catch (error) {
      debugError('Backup failed', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  /**
   * Select a backup file from dialog
   */
  async selectBackupFile(): Promise<{ success: boolean; filePath?: string; error?: string }> {
    try {
      const { filePaths } = await dialog.showOpenDialog({
        title: 'Select Backup File',
        filters: [{ name: 'Dockyard Backup', extensions: ['dockyard'] }],
        properties: ['openFile'],
      });

      if (filePaths.length === 0) {
        return { success: false, error: 'No file selected' };
      }

      return { success: true, filePath: filePaths[0] };
    } catch (error) {
      debugError('Select backup file failed', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  /**
   * Restore a backup from file
   */
  async restoreBackup(
    filePath: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      if (!fs.existsSync(filePath)) {
        return { success: false, error: 'Backup file not found' };
      }

      const fileBuffer = fs.readFileSync(filePath);

      // Extract parts
      if (
        fileBuffer.length <
        BackupService.SALT_LENGTH + BackupService.IV_LENGTH + BackupService.TAG_LENGTH
      ) {
        return { success: false, error: 'Invalid backup file format' };
      }

      let offset = 0;
      const salt = fileBuffer.subarray(offset, offset + BackupService.SALT_LENGTH);
      offset += BackupService.SALT_LENGTH;

      const iv = fileBuffer.subarray(offset, offset + BackupService.IV_LENGTH);
      offset += BackupService.IV_LENGTH;

      const tag = fileBuffer.subarray(offset, offset + BackupService.TAG_LENGTH);
      offset += BackupService.TAG_LENGTH;

      const encryptedData = fileBuffer.subarray(offset);

      // Decrypt
      const key = BackupService.getKey(password, salt);
      const decipher = crypto.createDecipheriv(BackupService.ALGORITHM, key, iv);
      decipher.setAuthTag(tag);

      let decrypted: Buffer;
      try {
        decrypted = Buffer.concat([decipher.update(encryptedData), decipher.final()]);
      } catch (e) {
        return { success: false, error: 'Incorrect password or corrupted file' };
      }

      // Verify ZIP
      const zip = new AdmZip(decrypted);
      const entries = zip.getEntries();
      const hasProfilesJson = entries.some((entry) => entry.entryName === 'profiles.json');

      if (!hasProfilesJson) {
        return { success: false, error: 'Invalid backup: missing profiles.json' };
      }

      // Restore data
      const userDataPath = app.getPath('userData');

      // Clear existing data (optional, but safer to avoid conflicts - though we can just overwrite)
      // zip.extractAllTo overwrites existing files
      zip.extractAllTo(userDataPath, true);

      // Relaunch to apply changes
      app.relaunch();
      app.exit(0);

      return { success: true };
    } catch (error) {
      debugError('Restore failed', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }
}
