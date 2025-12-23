import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatChipsModule } from '@angular/material/chips';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SupplierService } from '../../../services/supplier.service';
import { MessageDialogService } from '../../../services/message-dialog.service';
import { Supplier } from '../../../models/supplier.model';
import { SupplierFormComponent } from '../supplier-form/supplier-form.component';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-suppliers-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatChipsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './suppliers-list.component.html',
  styleUrl: './suppliers-list.component.scss'
})
export class SuppliersListComponent implements OnInit {
  suppliers: Supplier[] = [];
  allSuppliers: Supplier[] = [];
  filteredSuppliers: Supplier[] = [];
  paginatedSuppliers: Supplier[] = [];
  searchText: string = '';
  displayedColumns: string[] = ['supplierNumber', 'name', 'phone', 'email', 'supplierType', 'isPaid', 'actions'];
  pageSize: number = 10;
  pageIndex: number = 0;
  pageSizeOptions: number[] = [5, 10, 25, 50];
  isLoading: boolean = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private supplierService: SupplierService,
    private messageDialogService: MessageDialogService,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadSuppliers();
  }

  loadSuppliers(): void {
    this.isLoading = true;
    this.supplierService.getAll()
      .pipe(finalize(() => {
        this.isLoading = false;
        this.cdr.detectChanges();
      }))
      .subscribe({
        next: (response) => {
          if (response.isSuccess && response.data) {
            this.allSuppliers = [...response.data];
            this.applyFilter();
            this.cdr.detectChanges();
          } else {
            console.error('Failed to load suppliers:', response.errorText);
            this.messageDialogService.showError('שגיאה בטעינת ספקים: ' + (response.errorText || 'Unknown error'));
          }
        },
        error: (error) => {
          console.error('Error loading suppliers:', error);
          this.messageDialogService.showError('שגיאה בטעינת ספקים');
        }
      });
  }

  applyFilter(): void {
    const text = this.searchText ? this.searchText.trim().toLowerCase() : '';
    if (!text) {
      this.filteredSuppliers = [...this.allSuppliers];
    } else {
      this.filteredSuppliers = this.allSuppliers.filter(supplier => {
        return Object.values(supplier).some(val =>
          val && val.toString().toLowerCase().includes(text)
        );
      });
    }
    this.pageIndex = 0;
    this.updatePaginatedSuppliers();
  }

  updatePaginatedSuppliers(): void {
    const startIndex = this.pageIndex * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedSuppliers = this.filteredSuppliers.slice(startIndex, endIndex);
  }

  onPageChange(event: any): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updatePaginatedSuppliers();
  }

  get totalItems(): number {
    return this.filteredSuppliers.length;
  }

  clearSearch(): void {
    this.searchText = '';
    this.applyFilter();
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
    this.messageDialogService.confirm('האם אתה בטוח שברצונך למחוק ספק זה?', 'אישור מחיקה').subscribe((result: 'yes' | 'no') => {
      if (result === 'yes') {
        this.supplierService.delete(id).subscribe(response => {
          if (response.isSuccess) {
            this.messageDialogService.showSuccess('ספק נמחק בהצלחה');
            this.loadSuppliers();
          } else {
            console.error('Failed to delete supplier:', response.errorText);
            this.messageDialogService.showError('שגיאה במחיקת ספק: ' + (response.errorText || 'Unknown error'));
          }
        });
      }
    });
  }
}
