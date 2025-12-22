import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MessageDialogComponent, MessageDialogData } from '../components/shared/message-dialog/message-dialog.component';
import { ConfirmationDialogComponent, ConfirmationDialogData } from '../components/shared/confirmation-dialog/confirmation-dialog.component';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MessageDialogService {
  constructor(private dialog: MatDialog) {}

  /**
   * הצגת הודעת הצלחה
   */
  showSuccess(message?: string, title?: string) {
    return this.dialog.open(MessageDialogComponent, {
      data: {
        type: 'success',
        title: title,
        message: message
      } as MessageDialogData,
      width: '400px',
      direction: 'rtl'
    });
  }

  /**
   * הצגת הודעת שגיאה
   */
  showError(message?: string, title?: string) {
    return this.dialog.open(MessageDialogComponent, {
      data: {
        type: 'error',
        title: title,
        message: message
      } as MessageDialogData,
      width: '400px',
      direction: 'rtl'
    });
  }

  /**
   * הצגת הודעה כללית
   */
  showMessage(type: 'success' | 'error', message?: string, title?: string) {
    return this.dialog.open(MessageDialogComponent, {
      data: {
        type: type,
        title: title,
        message: message
      } as MessageDialogData,
      width: '400px',
      direction: 'rtl'
    });
  }

  /**
   * הצגת שאלת אישור עם כן/לא
   * @returns Observable<'yes' | 'no'> - 'yes' אם המשתמש לחץ כן, 'no' אם לחץ לא
   */
  confirm(message?: string, title?: string, confirmText?: string, cancelText?: string): Observable<'yes' | 'no'> {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: title,
        message: message,
        confirmText: confirmText,
        cancelText: cancelText
      } as ConfirmationDialogData,
      width: '500px',
      direction: 'rtl'
    });

    return dialogRef.afterClosed();
  }
}
