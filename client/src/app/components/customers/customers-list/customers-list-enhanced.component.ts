import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { CustomerService } from '../../../services/customer.service';
import { Customer } from '../../../models/customer.model';
import { CustomerFormComponent } from '../customer-form/customer-form.component';
import { finalize } from 'rxjs/operators';

interface CustomerWithProjects extends Customer {
  projects?: any[];
}

@Component({
  selector: 'app-customers-list-enhanced',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatExpansionModule,
    MatChipsModule,
    MatTooltipModule
  ],
  templateUrl: './customers-list-enhanced.component.html',
  styleUrl: './customers-list-enhanced.component.scss'
})
export class CustomersListEnhancedComponent implements OnInit {
  allCustomers: CustomerWithProjects[] = [];
  filteredCustomers: CustomerWithProjects[] = [];
  paginatedCustomers: CustomerWithProjects[] = [];
  searchText: string = '';
  pageSize: number = 10;
  pageIndex: number = 0;
  isLoading: boolean = false;

  constructor(
    private customerService: CustomerService,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCustomers();
  }

  loadCustomers(): void {
    this.isLoading = true;
    
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
            alert('שגיאה בטעינת לקוחות: ' + (response.errorText || 'Unknown error'));
          }
        },
        error: (error) => {
          console.error('Error loading customers:', error);
          alert('שגיאה בטעינת לקוחות');
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

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updatePaginatedCustomers();
  }

  clearSearch(): void {
    this.searchText = '';
    this.applyFilter();
  }

  openCustomerForm(customer?: CustomerWithProjects): void {
    const isMobile = window.innerWidth <= 768;
    const dialogRef = this.dialog.open(CustomerFormComponent, {
      width: isMobile ? '95vw' : '500px',
      maxWidth: isMobile ? '95vw' : '500px',
      data: customer
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadCustomers();
      }
    });
  }

  deleteCustomer(id: string): void {
    if (confirm('האם אתה בטוח שברצונך למחוק לקוח זה?')) {
      this.customerService.delete(id).subscribe({
        next: (response) => {
          if (response.isSuccess) {
            this.loadCustomers();
          } else {
            alert('שגיאה במחיקת לקוח: ' + (response.errorText || 'Unknown error'));
          }
        },
        error: (error) => {
          console.error('Error deleting customer:', error);
          alert('שגיאה במחיקת לקוח');
        }
      });
    }
  }

  createProjectForCustomer(customer: CustomerWithProjects): void {
    // Navigate to project creation with customer pre-selected
    this.router.navigate(['/projects'], { 
      queryParams: { customerId: customer.id } 
    });
  }

  openProject(project: any): void {
    this.router.navigate(['/projects', project.id]);
  }
}
