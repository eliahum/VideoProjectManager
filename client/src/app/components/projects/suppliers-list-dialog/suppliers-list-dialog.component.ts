import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';

export interface SupplierDetail {
  supplierName: string;
  amount: number;
  date?: Date;
  isPaid: boolean;
  milestoneName: string;
  stageName: string;
}

export interface SuppliersListDialogData {
  suppliers: SupplierDetail[];
  isPaidList: boolean;
  totalAmount: number;
}

@Component({
  selector: 'app-suppliers-list-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatListModule
  ],
  templateUrl: './suppliers-list-dialog.component.html',
  styleUrl: './suppliers-list-dialog.component.scss'
})
export class SuppliersListDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: SuppliersListDialogData,
    private dialogRef: MatDialogRef<SuppliersListDialogComponent>
  ) {}

  close(): void {
    this.dialogRef.close();
  }
}
