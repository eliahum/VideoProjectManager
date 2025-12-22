import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

export interface MessageDialogData {
  type: 'success' | 'error';
  title?: string;
  message?: string;
}

@Component({
  selector: 'app-message-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule],
  template: `
    <div class="message-dialog">
      <div class="dialog-header" [class.success]="data.type === 'success'" [class.error]="data.type === 'error'">
        <mat-icon>{{ data.type === 'success' ? 'check_circle' : 'error' }}</mat-icon>
        <h2 mat-dialog-title>{{ getTitle() }}</h2>
      </div>
      <mat-dialog-content>
        <p>{{ getMessage() }}</p>
      </mat-dialog-content>
      <mat-dialog-actions align="center">
        <button mat-raised-button [mat-dialog-close]="true" [color]="data.type === 'success' ? 'primary' : 'warn'">
          אישור
        </button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }

    .message-dialog {
      min-width: 300px;
      max-width: 500px;
      overflow: hidden;
    }

    .dialog-header {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px 24px;
      margin: -24px -24px 16px -24px;
      border-radius: 4px 4px 0 0;
    }

    .dialog-header.success {
      background-color: #4caf50;
      color: white;
    }

    .dialog-header.error {
      background-color: #f44336;
      color: white;
    }

    .dialog-header mat-icon {
      font-size: 32px;
      width: 32px;
      height: 32px;
    }

    .dialog-header h2 {
      margin: 0;
      font-size: 20px;
      font-weight: 500;
    }

    mat-dialog-content {
      padding: 16px 0 !important;
      font-size: 16px;
      line-height: 1.5;
      margin: 0 !important;
      max-height: none !important;
      overflow: visible !important;
    }

    mat-dialog-actions {
      padding: 16px 0 8px 0 !important;
      margin: 0 !important;
      min-height: auto !important;
    }
  `]
})
export class MessageDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<MessageDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: MessageDialogData
  ) {}

  getTitle(): string {
    if (this.data.title) {
      return this.data.title;
    }
    return this.data.type === 'success' ? 'הצלחה' : 'שגיאה';
  }

  getMessage(): string {
    if (this.data.message) {
      return this.data.message;
    }
    return this.data.type === 'success' 
      ? 'הפעולה בוצעה בהצלחה' 
      : 'אירעה שגיאה בביצוע הפעולה';
  }
}
