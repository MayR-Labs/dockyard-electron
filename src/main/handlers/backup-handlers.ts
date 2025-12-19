import { ipcMain } from 'electron';
import { IPC_CHANNELS } from '../../shared/constants';
import { BackupService } from '../services/backup-service';

export class BackupHandlers {
  constructor(private backupService: BackupService) {
    this.registerHandlers();
  }

  private registerHandlers(): void {
    ipcMain.handle(IPC_CHANNELS.BACKUP.CREATE, async (_, password: string) => {
      return this.backupService.createBackup(password);
    });

    ipcMain.handle(IPC_CHANNELS.BACKUP.RESTORE, async (_, password: string) => {
      return this.backupService.restoreBackup(password);
    });
  }
}
