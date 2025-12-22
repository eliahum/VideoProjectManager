import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CustomerService } from '../../../services/customer.service';
import { Customer } from '../../../models/customer.model';
import { CustomerFormComponent } from '../customer-form/customer-form.component';

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
    MatInputModule
  ],
  templateUrl: './customers-list.component.html',
  styleUrl: './customers-list.component.scss'
})
export class CustomersListComponent implements OnInit {
  customers: Customer[] = [];
  allCustomers: Customer[] = [];
  searchText: string = '';
  displayedColumns: string[] = ['name', 'phone', 'email', 'leadId', 'actions'];

  constructor(
    private customerService: CustomerService,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadCustomers();
  }

  loadCustomers(): void {
    this.customerService.getAll().subscribe(response => {
      if (response.isSuccess && response.data) {
        this.allCustomers = [...response.data];
        this.applyFilter();
        this.cdr.detectChanges();
      } else {
        console.error('Failed to load customers:', response.errorText);
        alert('שגיאה בטעינת לקוחות: ' + (response.errorText || 'Unknown error'));
      }
    });
  }

  applyFilter(): void {
    const text = this.searchText ? this.searchText.trim().toLowerCase() : '';
    if (!text) {
      this.customers = [...this.allCustomers];
      return;
    }
    this.customers = this.allCustomers.filter(customer => {
      return Object.values(customer).some(val =>
        val && val.toString().toLowerCase().includes(text)
      );
    });
  }

  clearSearch(): void {
    this.searchText = '';
    this.applyFilter();
  }

  openCustomerForm(customer?: Customer): void {
    const dialogRef = this.dialog.open(CustomerFormComponent, {
      width: '500px',
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
      this.customerService.delete(id).subscribe(response => {
        if (response.isSuccess) {
          this.loadCustomers();
        } else {
          console.error('Failed to delete customer:', response.errorText);
          alert('שגיאה במחיקת לקוח: ' + (response.errorText || 'Unknown error'));
        }
      });
    }
  }
}
