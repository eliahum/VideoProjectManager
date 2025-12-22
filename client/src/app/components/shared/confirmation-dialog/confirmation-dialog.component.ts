import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

export interface ConfirmationDialogData {
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
}

@Component({
  selector: 'app-confirmation-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule],
  template: `
    <div class="confirmation-dialog">
      <div class="dialog-header">
        <mat-icon>help_outline</mat-icon>
        <h2 mat-dialog-title>{{ getTitle() }}</h2>
      </div>
      <mat-dialog-content>
        <p>{{ getMessage() }}</p>
      </mat-dialog-content>
      <mat-dialog-actions align="center">
        <button mat-button [mat-dialog-close]="'no'">
          {{ getCancelText() }}
        </button>
        <button mat-raised-button color="primary" [mat-dialog-close]="'yes'">
          {{ getConfirmText() }}
        </button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }

    .confirmation-dialog {
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
      background-color: #2196f3;
      color: white;
      border-radius: 4px 4px 0 0;
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
      gap: 8px;
      min-height: auto !important;
    }
  `]
})
export class ConfirmationDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmationDialogData
  ) {}

  getTitle(): string {
    return this.data.title || 'אישור פעולה';
  }

  getMessage(): string {
    return this.data.message || 'האם אתה בטוח שברצונך לבצע פעולה זו?';
  }

  getConfirmText(): string {
    return this.data.confirmText || 'כן';
  }

  getCancelText(): string {
    return this.data.cancelText || 'לא';
  }
}
