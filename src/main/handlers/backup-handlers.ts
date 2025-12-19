import { ipcMain } from 'electron';
import { IPC_CHANNELS } from '../../shared/constants';
import { BackupService } from '../services/backup-service';

export class BackupHandlers {
  constructor(private backupService: BackupService) {
    console.log('Registering Backup Handlers...');
    this.registerHandlers();
  }

  private registerHandlers(): void {
    ipcMain.handle(IPC_CHANNELS.BACKUP.CREATE, async (_, password: string) => {
      return this.backupService.createBackup(password);
    });

    ipcMain.handle(IPC_CHANNELS.BACKUP.SELECT_FILE, async () => {
      return this.backupService.selectBackupFile();
    });

    ipcMain.handle(IPC_CHANNELS.BACKUP.RESTORE, async (_, filePath: string, password: string) => {
      return this.backupService.restoreBackup(filePath, password);
    });
  }
}
