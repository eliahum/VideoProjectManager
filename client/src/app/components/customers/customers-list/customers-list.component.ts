import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { CustomerService } from '../../../services/customer.service';
import { Customer } from '../../../models/customer.model';
import { CustomerFormComponent } from '../customer-form/customer-form.component';
import { CustomerProjectsDialogComponent } from '../customer-projects-dialog/customer-projects-dialog.component';
import { MessageDialogService } from '../../../services/message-dialog.service';
import { finalize } from 'rxjs/operators';
import { SAMPLE_CUSTOMERS_WITH_PROJECTS } from './customers-sample-data';

@Component({
  selector: 'app-customers-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatExpansionModule,
    MatChipsModule,
    MatTooltipModule
  ],
  templateUrl: './customers-list.component.html',
  styleUrl: './customers-list.component.scss'
})
export class CustomersListComponent implements OnInit {
  customers: any[] = [];
  allCustomers: any[] = [];
  filteredCustomers: any[] = [];
  paginatedCustomers: any[] = [];
  searchText: string = '';
  displayedColumns: string[] = ['customerid','companyName','name', 'phone', 'email', 'leadId', 'projects', 'actions'];
  pageSize: number = 10;
  pageIndex: number = 0;
  pageSizeOptions: number[] = [5, 10, 25, 50];
  isLoading: boolean = false;
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private customerService: CustomerService,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private messageDialogService: MessageDialogService
  ) {}

  ngOnInit(): void {
    this.loadCustomers();
  }

  loadCustomers(): void {
    this.isLoading = true;
    
    // Use real data from server
    this.customerService.getAll()
      .pipe(finalize(() => {
        this.isLoading = false;
        this.cdr.detectChanges();
      }))
      .subscribe({
        next: (response) => {
          if (response.isSuccess && response.data) {
            this.allCustomers = [...response.data];
            this.applyFilter();
            this.cdr.detectChanges();
          } else {
            console.error('Failed to load customers:', response.errorText);
            this.messageDialogService.showError('שגיאה בטעינת לקוחות: ' + (response.errorText || 'Unknown error'));
          }
        },
        error: (error) => {
          console.error('Error loading customers:', error);
          this.messageDialogService.showError('שגיאה בטעינת לקוחות');
        }
      });
  }

  applyFilter(): void {
    const text = this.searchText ? this.searchText.trim().toLowerCase() : '';
    if (!text) {
      this.filteredCustomers = [...this.allCustomers];
    } else {
      this.filteredCustomers = this.allCustomers.filter(customer => {
        return Object.values(customer).some(val =>
          val && val.toString().toLowerCase().includes(text)
        );
      });
    }
    this.pageIndex = 0;
    this.updatePaginatedCustomers();
  }

  updatePaginatedCustomers(): void {
    const startIndex = this.pageIndex * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedCustomers = this.filteredCustomers.slice(startIndex, endIndex);
  }

  onPageChange(event: any): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updatePaginatedCustomers();
  }

  get totalItems(): number {
    return this.filteredCustomers.length;
  }

  clearSearch(): void {
    this.searchText = '';
    this.applyFilter();
  }

  openCustomerForm(customer?: Customer): void {
    const isMobile = window.innerWidth <= 768;
    const dialogRef = this.dialog.open(CustomerFormComponent, {
      width: isMobile ? '95vw' : '600px',
      maxWidth: isMobile ? '95vw' : '600px',
      disableClose: true,
      data: customer
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadCustomers();
      }
    });
  }

  deleteCustomer(id: string): void {
    this.messageDialogService.confirm('האם אתה בטוח שברצונך למחוק לקוח זה?').subscribe((result: 'yes' | 'no') => {
      if (result === 'yes') {
        this.customerService.delete(id).subscribe(response => {
          if (response.isSuccess) {
            this.messageDialogService.showSuccess('לקוח נמחק בהצלחה');
            this.loadCustomers();
          } else {
            console.error('Failed to delete customer:', response.errorText);
            this.messageDialogService.showError('שגיאה במחיקת לקוח: ' + (response.errorText || 'Unknown error'));
          }
        });
      }
    });
  }

  openCustomerProjects(customer: any): void {
    const dialogRef = this.dialog.open(CustomerProjectsDialogComponent, {
      width: '900px',
      maxWidth: '95vw',
      maxHeight: '90vh',
      disableClose: true,
      data: { customer }
    });

    dialogRef.afterClosed().subscribe(() => {
      // Optionally reload customers if projects were modified
      this.loadCustomers();
    });
  }

  createProjectForCustomer(customer: any): void {
    console.log('Create project for customer:', customer);
    // Navigate to project creation with customer pre-selected
    this.router.navigate(['/projects/new'], { 
      queryParams: { customerId: customer.id, customerName: customer.name } 
    });
  }

  openProject(project: any): void {
    console.log('Open project:', project);
    // Navigate to project details
    this.router.navigate(['/projects', project.projectNumber]);
  }
}
