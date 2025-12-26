import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { CustomerService } from '../../../services/customer.service';
import { Customer } from '../../../models/customer.model';

@Component({
  selector: 'app-manage-customers-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatIconModule,
    MatCardModule
  ],
  templateUrl: './manage-customers-dialog.component.html',
  styleUrl: './manage-customers-dialog.component.scss'
})
export class ManageCustomersDialogComponent implements OnInit {
  customersForm: FormGroup;
  availableCustomers: Customer[] = [];

  constructor(
    private fb: FormBuilder,
    private customerService: CustomerService,
    private dialogRef: MatDialogRef<ManageCustomersDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { customers: Array<{customerId: string, customerName: string}> }
  ) {
    this.customersForm = this.fb.group({
      customers: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.customerService.getAll().subscribe(response => {
      if (response.isSuccess && response.data) {
        this.availableCustomers = response.data;
      }
    });

    // Load existing customers
    if (this.data.customers && this.data.customers.length > 0) {
      this.data.customers.forEach(customer => {
        this.addCustomer(customer);
      });
    }
  }

  get customers(): FormArray {
    return this.customersForm.get('customers') as FormArray;
  }

  addCustomer(existing?: {customerId: string, customerName: string}): void {
    const customerGroup = this.fb.group({
      customerId: [existing?.customerId || '', Validators.required],
      customerName: [existing?.customerName || '']
    });

    // Update customer name when customer is selected
    customerGroup.get('customerId')?.valueChanges.subscribe(customerId => {
      const customer = this.availableCustomers.find(c => c.id === customerId);
      if (customer) {
        customerGroup.patchValue({ customerName: customer.name });
      }
    });

    this.customers.push(customerGroup);
  }

  removeCustomer(index: number): void {
    this.customers.removeAt(index);
  }

  onSave(): void {
    if (this.customersForm.valid) {
      const hasEmptyCustomers = this.customers.controls.some(
        customer => !customer.get('customerId')?.value
      );
      
      if (hasEmptyCustomers) {
        alert('נא לבחור לקוח או למחוק שורות ריקות');
        return;
      }

      this.dialogRef.close(this.customersForm.value.customers);
    }
  }

  close(): void {
    this.dialogRef.close();
  }
}
