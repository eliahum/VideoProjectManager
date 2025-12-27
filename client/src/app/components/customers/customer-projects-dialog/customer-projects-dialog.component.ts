import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { Router } from '@angular/router';

@Component({
  selector: 'app-customer-projects-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatChipsModule
  ],
  templateUrl: './customer-projects-dialog.component.html',
  styleUrl: './customer-projects-dialog.component.scss'
})
export class CustomerProjectsDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { customer: any },
    private dialogRef: MatDialogRef<CustomerProjectsDialogComponent>,
    private router: Router
  ) {}

  openProject(project: any): void {
    this.router.navigate(['/projects', project.id]);
    this.dialogRef.close();

  }

  createProjectForCustomer(customer: any): void {
    this.dialogRef.close();
    this.router.navigate(['/projects/new'], { queryParams: { customerId: customer.customerId } });
  }

  close(): void {
    this.dialogRef.close();
  }
}
