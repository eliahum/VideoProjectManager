import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatChipsModule } from '@angular/material/chips';
import { MatCardModule } from '@angular/material/card';
import { SupplierService } from '../../../services/supplier.service';
import { Supplier } from '../../../models/supplier.model';
import { SupplierFormComponent } from '../supplier-form/supplier-form.component';

@Component({
  selector: 'app-suppliers-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatChipsModule,
    MatCardModule
  ],
  templateUrl: './suppliers-list.component.html',
  styleUrl: './suppliers-list.component.scss'
})
export class SuppliersListComponent implements OnInit {
  suppliers: Supplier[] = [];
  displayedColumns: string[] = ['name', 'phone', 'email', 'isPaid', 'actions'];

  constructor(
    private supplierService: SupplierService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadSuppliers();
  }

  loadSuppliers(): void {
    this.supplierService.getAll().subscribe(suppliers => {
      this.suppliers = suppliers;
    });
  }

  openSupplierForm(supplier?: Supplier): void {
    const isMobile = window.innerWidth <= 768;
    const dialogRef = this.dialog.open(SupplierFormComponent, {
      width: isMobile ? '95vw' : '600px',
      maxWidth: isMobile ? '95vw' : '600px',
      data: supplier
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadSuppliers();
      }
    });
  }

  deleteSupplier(id: string): void {
    if (confirm('האם אתה בטוח שברצונך למחוק ספק זה?')) {
      this.supplierService.delete(id).subscribe(() => {
        this.loadSuppliers();
      });
    }
  }
}
