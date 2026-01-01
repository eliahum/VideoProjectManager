/**
 * Backup Service - ניהול גיבויים של MongoDB
 */

import mongoose from 'mongoose';
import * as fs from 'fs';
import * as path from 'path';
import { GoogleDriveServiceAuth } from './googleDriveServiceAuth';

export interface BackupInfo {
  timestamp: string;
  filename: string;
  size: number;
  status: 'success' | 'failed' | 'in-progress';
  uploadedToCloud: boolean;
  error?: string;
}

export interface BackupScheduleInfo {
  enabled: boolean;
  cronExpression: string;
  timezone: string;
  nextRun?: string;
  description: string;
}

export class BackupService {
  private backupsDir: string;

  constructor() {
    this.backupsDir = path.join(__dirname, '..', 'backups');
    //this.ensureBackupsDirectory();
  }

  /**
   * וידוא שקיימת תיקיית גיבויים
   */
  private ensureBackupsDirectory(): void {
    if (!fs.existsSync(this.backupsDir)) {
      fs.mkdirSync(this.backupsDir, { recursive: true });
    }
  }

  /**
   * יצירת גיבוי חדש
   */
  async createBackup(): Promise<BackupInfo> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
    const fileName = `backup-${timestamp}.json`;
    const filePath = path.join(this.backupsDir, fileName);

    try {
      console.log('🔄 Starting MongoDB backup...');

      const db = mongoose.connection.db;
      if (!db) {
        throw new Error('Database connection not available');
      }

      // Get all collections
      const collections = await db.listCollections().toArray();
      const backup: any = {
        timestamp: new Date().toISOString(),
        database: db.databaseName,
        collections: {}
      };

      console.log(`📊 Found ${collections.length} collections`);

      // Export each collection
      for (const collectionInfo of collections) {
        const collectionName = collectionInfo.name;
        console.log(`  📦 Backing up: ${collectionName}...`);

        const collection = db.collection(collectionName);
        const documents = await collection.find({}).toArray();

        backup.collections[collectionName] = documents;
        console.log(`     ✓ ${documents.length} documents exported`);
      }

      // Prepare backup data
      const backupJson = JSON.stringify(backup, null, 2);
      const fileSize = Buffer.byteLength(backupJson, 'utf8');

      // Save to file
//      fs.writeFileSync(filePath, backupJson, 'utf8');
  //    console.log(`✅ Backup saved to: ${fileName}`);

      // Upload to Google Drive if enabled
      let uploadedToCloud = false;
      if (process.env.ENABLE_GOOGLE_DRIVE_OAUTH_BACKUP === 'true') {
        try {
          console.log('☁️  Uploading to Google Drive...');
          const driveServiceAuth = new GoogleDriveServiceAuth(
            process.env.GOOGLE_OAUTH_CLIENT_ID!,
            process.env.GOOGLE_OAUTH_CLIENT_SECRET!,
            process.env.GOOGLE_OAUTH_REFRESH_TOKEN!
          );

          const folderId = process.env.GOOGLE_OAUTH_FOLDER_ID;
          await driveServiceAuth.uploadFromMemory(backupJson, fileName, folderId);
          uploadedToCloud = true;
          console.log('✅ Uploaded to Google Drive');
        } catch (error: any) {
          console.error('⚠️  Google Drive upload failed:', error.message);
        }
      }

      return {
        timestamp: new Date().toISOString(),
        filename: fileName,
        size: fileSize,
        status: 'success',
        uploadedToCloud
      };
    } catch (error: any) {
      console.error('❌ Backup failed:', error);
      throw new Error(`Backup creation failed: ${error.message}`);
    }
  }

  /**
   * קבלת היסטוריית גיבויים מ-Google Drive
   */
  async getBackupHistory(): Promise<BackupInfo[]> {
    try {
      // אם Google Drive מופעל, קרא מהענן
      //if (process.env.ENABLE_GOOGLE_DRIVE_OAUTH_BACKUP === 'true') {
        return await this.getBackupHistoryFromCloud();
      //}
      
      // אחרת, קרא מהתיקייה המקומית
      //return await this.getBackupHistoryFromLocal();
    } catch (error: any) {
      console.error('Error reading backup history:', error);
      // במקרה של שגיאה, נסה לקרוא מהמקומי
     
    }
  }

  /**
   * קבלת היסטוריית גיבויים מ-Google Drive
   */
  private async getBackupHistoryFromCloud(): Promise<BackupInfo[]> {
    try {
      console.log('📥 Fetching backup history from Google Drive...');
      
      const driveServiceAuth = new GoogleDriveServiceAuth(
        process.env.GOOGLE_OAUTH_CLIENT_ID!,
        process.env.GOOGLE_OAUTH_CLIENT_SECRET!,
        process.env.GOOGLE_OAUTH_REFRESH_TOKEN!
      );

      const folderId = process.env.GOOGLE_OAUTH_FOLDER_ID;
      const files = await driveServiceAuth.listFiles(folderId);

      // סנן רק קבצי גיבוי
      const backupFiles = files.filter(file => 
        file.name && 
        file.name.startsWith('backup-') && 
        file.name.endsWith('.json')
      );

      console.log(`✅ Found ${backupFiles.length} backups in Google Drive`);

      const backups: BackupInfo[] = backupFiles.map(file => {
        // Extract timestamp from filename
        const timestampStr = file.name.replace('backup-', '').replace('.json', '');
        const timestamp = this.parseBackupTimestamp(timestampStr);
        
        // Convert to UTC+2 (Israel time)
        const timestampUTC2 = new Date(timestamp.getTime() + 2 * 60 * 60 * 1000);

        return {
          timestamp: timestampUTC2.toISOString(),
          filename: file.name,
          size: parseInt(file.size || '0'),
          status: 'success' as const,
          uploadedToCloud: true // בוודאות הועלה כי אנחנו קוראים מהענן
        };
      });

      // Sort by timestamp, newest first
      backups.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

      return backups;
    } catch (error: any) {
      console.error('Error reading backup history from cloud:', error);
      throw error;
    }
  }

  /**
   * קבלת היסטוריית גיבויים מהתיקייה המקומית
   */
  private async getBackupHistoryFromLocal(): Promise<BackupInfo[]> {
    try {
      const files = fs.readdirSync(this.backupsDir);
      const backupFiles = files.filter(file => file.startsWith('backup-') && file.endsWith('.json'));

      const backups: BackupInfo[] = backupFiles.map(filename => {
        const filePath = path.join(this.backupsDir, filename);
        const stats = fs.statSync(filePath);
        
        // Extract timestamp from filename
        const timestampStr = filename.replace('backup-', '').replace('.json', '');
        const timestamp = this.parseBackupTimestamp(timestampStr);

        return {
          timestamp: timestamp.toISOString(),
          filename,
          size: stats.size,
          status: 'success' as const,
          uploadedToCloud: false
        };
      });

      // Sort by timestamp, newest first
      backups.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

      return backups;
    } catch (error: any) {
      console.error('Error reading local backup history:', error);
      throw error;
    }
  }

  /**
   * קבלת הגיבוי האחרון
   */
  async getLastBackup(): Promise<BackupInfo | null> {
    try {
      const history = await this.getBackupHistory();
      return history.length > 0 ? history[0] : null;
    } catch (error) {
      console.error('Error getting last backup:', error);
      return null;
    }
  }

  /**
   * קבלת קובץ גיבוי מהענן או מקומי
   */
  async downloadBackupFile(filename: string): Promise<Buffer> {
    // Security check - ensure filename is safe
    if (!filename.startsWith('backup-') || !filename.endsWith('.json')) {
      throw new Error('Invalid backup filename');
    }

    // אם Google Drive מופעל, הורד מהענן
    if (process.env.ENABLE_GOOGLE_DRIVE_OAUTH_BACKUP === 'true') {
      try {
        console.log(`📥 Downloading ${filename} from Google Drive...`);
        const driveServiceAuth = new GoogleDriveServiceAuth(
          process.env.GOOGLE_OAUTH_CLIENT_ID!,
          process.env.GOOGLE_OAUTH_CLIENT_SECRET!,
          process.env.GOOGLE_OAUTH_REFRESH_TOKEN!
        );

        const folderId = process.env.GOOGLE_OAUTH_FOLDER_ID;
        const fileBuffer = await driveServiceAuth.downloadFile(filename, folderId);
        console.log(`✅ Downloaded ${filename} from Google Drive`);
        return fileBuffer;
      } catch (error: any) {
        console.error('Error downloading from Google Drive:', error);
        // אם נכשל, נסה מהתיקייה המקומית
        return this.downloadBackupFileFromLocal(filename);
      }
    }

    // אחרת, הורד מהתיקייה המקומית
    return this.downloadBackupFileFromLocal(filename);
  }

  /**
   * קבלת קובץ גיבוי מהתיקייה המקומית
   */
  private downloadBackupFileFromLocal(filename: string): Buffer {
    const filePath = path.join(this.backupsDir, filename);
    
    if (!fs.existsSync(filePath)) {
      throw new Error('Backup file not found locally');
    }

    return fs.readFileSync(filePath);
  }

  /**
   * קבלת קובץ גיבוי (מיושן - להתאמה לאחור)
   */
  getBackupFile(filename: string): string {
    const filePath = path.join(this.backupsDir, filename);
    
    // Security check - ensure filename is safe
    if (!filename.startsWith('backup-') || !filename.endsWith('.json')) {
      throw new Error('Invalid backup filename');
    }

    if (!fs.existsSync(filePath)) {
      throw new Error('Backup file not found');
    }

    return filePath;
  }

  /**
   * המרת timestamp משם קובץ לתאריך
   */
  private parseBackupTimestamp(timestampStr: string): Date {
    // Format: 2025-12-30T14-23-45
    const isoStr = timestampStr.replace(/-(\d{2})-(\d{2})$/, ':$1:$2');
    return new Date(isoStr);
  }

  /**
   * קבלת מידע על לוח הזמנים האוטומטי מקובץ YAML
   */
  getScheduleInfo(): BackupScheduleInfo {
    try {
      const yamlPath = path.join(__dirname, '..', '..', '.github', 'workflows', 'backupdb-andupload-googledrive.yml');
      
      if (!fs.existsSync(yamlPath)) {
        return {
          enabled: false,
          cronExpression: '',
          timezone: 'UTC',
          description: 'לוח זמנים לא זמין'
        };
      }

      const yamlContent = fs.readFileSync(yamlPath, 'utf8');
      
      // Extract cron expression using regex
      const cronMatch = yamlContent.match(/cron:\s*["'](.+?)["']/);
      const cronExpression = cronMatch ? cronMatch[1] : '';
      
      if (!cronExpression) {
        return {
          enabled: false,
          cronExpression: '',
          timezone: 'UTC',
          description: 'לוח זמנים לא מוגדר'
        };
      }

      // Parse cron expression (format: "minute hour day month dayOfWeek")
      const cronParts = cronExpression.split(' ');
      const description = this.describeCron(cronParts);

      return {
        enabled: true,
        cronExpression,
        timezone: 'UTC',
        description
      };
    } catch (error) {
      console.error('Error reading schedule info:', error);
      return {
        enabled: false,
        cronExpression: '',
        timezone: 'UTC',
        description: 'שגיאה בקריאת לוח הזמנים'
      };
    }
  }

  /**
   * המרת ביטוי cron לתיאור קריא
   */
  private describeCron(parts: string[]): string {
    if (parts.length < 5) return 'לוח זמנים לא תקין';

    const [minute, hour] = parts;

    // Check if it's daily
    if (parts[2] === '*' && parts[3] === '*' && parts[4] === '*') {
      return `יומי בשעה ${hour.padStart(2, '0')}:${minute.padStart(2, '0')} UTC`;
    }

    return `מתוזמן לפי: ${parts.join(' ')}`;
  }

  /**
   * ניקוי גיבויים ישנים מ-Google Drive
   * @param retentionDays - מספר הימים לשמירת גיבויים (ברירת מחדל: 90)
   * @returns מספר הקבצים שנמחקו
   */
  async cleanupOldBackups(retentionDays: number = 90): Promise<number> {
    try {
      console.log(`🧹 Starting cleanup of backups older than ${retentionDays} days...`);

      // חישוב תאריך חתך
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - retentionDays);
      console.log(`📅 Cutoff date: ${cutoffDate.toISOString()}`);

      // קבלת כל הגיבויים
      const backups = await this.getBackupHistory();
      
      // סינון גיבויים ישנים
      const oldBackups = backups.filter(backup => {
        const backupDate = new Date(backup.timestamp);
        return backupDate < cutoffDate;
      });

      if (oldBackups.length === 0) {
        console.log('✅ No old backups to delete');
        return 0;
      }

      console.log(`🗑️  Found ${oldBackups.length} old backups to delete`);

      // מחיקת גיבויים ישנים מ-Google Drive
      const driveServiceAuth = new GoogleDriveServiceAuth(
        process.env.GOOGLE_OAUTH_CLIENT_ID!,
        process.env.GOOGLE_OAUTH_CLIENT_SECRET!,
        process.env.GOOGLE_OAUTH_REFRESH_TOKEN!
      );

      const folderId = process.env.GOOGLE_OAUTH_FOLDER_ID;
      let deletedCount = 0;

      for (const backup of oldBackups) {
        try {
          // מציאת ה-file ID ב-Google Drive
          const files = await driveServiceAuth.listFiles(folderId);
          const fileToDelete = files.find(f => f.name === backup.filename);

          if (fileToDelete && fileToDelete.id) {
            await driveServiceAuth.deleteFile(fileToDelete.id);
            console.log(`   ✓ Deleted: ${backup.filename} (${new Date(backup.timestamp).toLocaleDateString()})`);
            deletedCount++;
          }
        } catch (error: any) {
          console.error(`   ✗ Failed to delete ${backup.filename}:`, error.message);
        }
      }

      console.log(`✅ Cleanup completed. Deleted ${deletedCount}/${oldBackups.length} old backups`);
      return deletedCount;
    } catch (error: any) {
      console.error('❌ Error during cleanup:', error);
      return 0;
    }
  }

  /**
   * שחזור גיבוי מקובץ
   * @param backupData - נתוני הגיבוי בפורמט JSON
   */
  async restoreBackup(backupData: any): Promise<void> {
    try {
      console.log('🔄 Starting MongoDB restore...');

      const db = mongoose.connection.db;
      if (!db) {
        throw new Error('Database connection not available');
      }

      console.log(`📊 Backup from: ${backupData.timestamp}`);
      console.log(`📚 Database: ${backupData.database}`);

      // Restore each collection
      const collectionNames = Object.keys(backupData.collections);
      console.log(`📦 Restoring ${collectionNames.length} collections...`);

      for (const collectionName of collectionNames) {
        const documents = backupData.collections[collectionName];
        
        console.log(`  📦 Restoring: ${collectionName}...`);
        
        // Drop existing collection
        try {
          await db.collection(collectionName).drop();
          console.log(`     🗑️  Dropped existing collection`);
        } catch (err) {
          // Collection might not exist, that's okay
          console.log(`     ℹ️  Collection didn't exist`);
        }

        // Insert documents
        if (documents && documents.length > 0) {
          await db.collection(collectionName).insertMany(documents);
          console.log(`     ✓ Restored ${documents.length} documents`);
        } else {
          console.log(`     ℹ️  No documents to restore`);
        }
      }

      console.log('✅ Restore completed successfully!');
    } catch (error: any) {
      console.error('❌ Restore failed:', error);
      throw new Error(`Restore failed: ${error.message}`);
    }
  }
}
