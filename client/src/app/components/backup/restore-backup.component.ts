import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { BackupService } from '../../services/backup.service';
import { MessageDialogService } from '../../services/message-dialog.service';

@Component({
  selector: 'app-restore-backup',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './restore-backup.component.html',
  styleUrls: ['./restore-backup.component.scss']
})
export class RestoreBackupComponent {
  selectedFile: File | null = null;
  isRestoring = false;
  errorMessage = '';
  successMessage = '';
  fileInfo: { name: string; size: string; timestamp?: string } | null = null;

  constructor(
    private backupService: BackupService,
    private router: Router,
    private messageDialogService: MessageDialogService
  ) {}

  /**
   * טיפול בבחירת קובץ
   */
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      
      // Validate file
      if (!file.name.startsWith('backup-') || !file.name.endsWith('.json')) {
        this.errorMessage = 'יש להעלות קובץ גיבוי תקין (backup-*.json)';
        this.selectedFile = null;
        this.fileInfo = null;
        return;
      }

      this.selectedFile = file;
      this.errorMessage = '';
      
      // Extract info from filename
      const sizeInMB = (file.size / (1024 * 1024)).toFixed(2);
      const timestampStr = file.name.replace('backup-', '').replace('.json', '');
      
      this.fileInfo = {
        name: file.name,
        size: `${sizeInMB} MB`,
        timestamp: this.parseTimestampFromFilename(timestampStr)
      };
    }
  }

  /**
   * המרת timestamp משם הקובץ לפורמט קריא
   */
  private parseTimestampFromFilename(timestampStr: string): string {
    try {
      // Format: 2025-12-30T14-23-45
      const isoStr = timestampStr.replace(/-(\d{2})-(\d{2})$/, ':$1:$2');
      const date = new Date(isoStr);
      return date.toLocaleString('he-IL', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return timestampStr;
    }
  }

  /**
   * הצגת דיאלוג אישור
   */
  showConfirmation(): void {
    if (!this.selectedFile) {
      this.errorMessage = 'יש לבחור קובץ גיבוי';
      return;
    }

    const message = `האם אתה בטוח שברצונך לשחזר את הגיבוי?\n\nקובץ: ${this.fileInfo?.name}\n\nפעולה זו תמחק את כל המידע הנוכחי ותחליף אותו בנתוני הגיבוי.`;
    
    this.messageDialogService.confirm(message, 'אישור שחזור גיבוי').subscribe((result: 'yes' | 'no') => {
      if (result === 'yes') {
        this.restoreBackup();
      }
    });
  }

  /**
   * שחזור הגיבוי
   */
  private restoreBackup(): void {
    console.log('restoreBackup called with file:', this.selectedFile);
    if (!this.selectedFile) {
      console.error('No file selected!');
      return;
    }

    this.isRestoring = true;
    this.errorMessage = '';
    this.successMessage = '';

    console.log('Calling backupService.restoreBackup...');
    this.backupService.restoreBackup(this.selectedFile).subscribe({
      next: (response) => {
        console.log('Response received:', response);
        this.isRestoring = false;
        
        if (response.success) {
          this.successMessage = 'הגיבוי שוחזר בהצלחה! המערכת תרענן את עצמה...';
          
          // Redirect to login after 3 seconds
          setTimeout(() => {
            // Clear local storage to force re-login
            localStorage.clear();
            sessionStorage.clear();
            window.location.href = '/login';
          }, 3000);
        } else {
          this.errorMessage = response.message || 'שגיאה בשחזור הגיבוי';
        }
      },
      error: (error) => {
        console.error('Error received:', error);
        this.isRestoring = false;
        this.errorMessage = error.error?.message || 'שגיאה בחיבור לשרת';
        console.error('שגיאה בשחזור גיבוי:', error);
      }
    });
  }

  /**
   * ניקוי הטופס
   */
  clearForm(): void {
    this.selectedFile = null;
    this.fileInfo = null;
    this.errorMessage = '';
    this.successMessage = '';
    
    // Reset file input
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  /**
   * חזרה לעמוד הגיבויים
   */
  goBack(): void {
    this.router.navigate(['/backup']);
  }
}
