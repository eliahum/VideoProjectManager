import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BackupService, BackupInfo, BackupScheduleInfo } from '../../services/backup.service';

@Component({
  selector: 'app-backup',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './backup.component.html',
  styleUrls: ['./backup.component.scss']
})
export class BackupComponent implements OnInit {
  isCreatingBackup = false;
  lastBackup: BackupInfo | null = null;
  backupHistory: BackupInfo[] = [];
  currentStatus = 'מוכן';
  errorMessage = '';
  successMessage = '';
  scheduleInfo: BackupScheduleInfo | null = null;

  constructor(
    private backupService: BackupService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadLastBackup();
    this.loadBackupHistory();
    this.loadScheduleInfo();
  }

  /**
   * טעינת מידע על הגיבוי האחרון
   */
  loadLastBackup(): void {
    this.backupService.getLastBackup().subscribe({
      next: (backup) => {
        this.lastBackup = backup;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('שגיאה בטעינת הגיבוי האחרון:', error);
      }
    });
  }

  /**
   * טעינת היסטוריית גיבויים
   */
  loadBackupHistory(): void {
    this.backupService.getBackupHistory().subscribe({
      next: (response) => {
        if (response.success) {
          this.backupHistory = response.backups.slice(0, 5); // 5 הגיבויים האחרונים
          this.cdr.detectChanges();
        }
      },
      error: (error) => {
        console.error('שגיאה בטעינת היסטוריית גיבויים:', error);
      }
    });
  }

  /**
   * טעינת מידע על לוח הזמנים האוטומטי
   */
  loadScheduleInfo(): void {
    this.backupService.getScheduleInfo().subscribe({
      next: (info) => {
        this.scheduleInfo = info;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('שגיאה בטעינת מידע על לוח הזמנים:', error);
      }
    });
  }

  /**
   * יצירת גיבוי ידני
   */
  createBackup(): void {
    this.isCreatingBackup = true;
    this.currentStatus = 'יוצר גיבוי...';
    this.errorMessage = '';
    this.successMessage = '';

    this.backupService.createBackup().subscribe({
      next: (response) => {
        this.isCreatingBackup = false;
        
        if (response.success) {
          this.currentStatus = 'מוכן';
          this.successMessage = 'הגיבוי נוצר בהצלחה!';
          
          // רענן את המידע
          this.loadLastBackup();
          this.loadBackupHistory();

          // נקה הודעת הצלחה אחרי 5 שניות
          setTimeout(() => {
            this.successMessage = '';
          }, 5000);
        } else {
          this.currentStatus = 'שגיאה';
          this.errorMessage = response.message || 'שגיאה בלתי צפויה';
        }
      },
      error: (error) => {
        this.isCreatingBackup = false;
        this.currentStatus = 'שגיאה';
        this.errorMessage = error.error?.message || 'שגיאה בחיבור לשרת';
        console.error('שגיאה ביצירת גיבוי:', error);
      }
    });
  }

  /**
   * הורדת קובץ גיבוי
   */
  downloadBackup(backup: BackupInfo): void {
    this.backupService.downloadBackup(backup.filename).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = backup.filename;
        link.click();
        window.URL.revokeObjectURL(url);
      },
      error: (error) => {
        console.error('שגיאה בהורדת הגיבוי:', error);
        this.errorMessage = 'שגיאה בהורדת הגיבוי';
      }
    });
  }

  /**
   * פורמט תאריך
   */
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleString('he-IL', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  /**
   * פורמט גודל קובץ
   */
  formatSize(bytes: number): string {
    if (bytes === 0) return '0 KB';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  }

  /**
   * קבלת אייקון סטטוס
   */
  getStatusIcon(status: string): string {
    switch (status) {
      case 'success':
        return '✅';
      case 'failed':
        return '❌';
      case 'in-progress':
        return '🔄';
      default:
        return '⚪';
    }
  }

  /**
   * קבלת טקסט סטטוס
   */
  getStatusText(status: string): string {
    switch (status) {
      case 'success':
        return 'הצלחה';
      case 'failed':
        return 'נכשל';
      case 'in-progress':
        return 'בתהליך';
      default:
        return 'לא ידוע';
    }
  }
}
