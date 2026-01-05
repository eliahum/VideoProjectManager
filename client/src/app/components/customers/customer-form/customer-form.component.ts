import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CustomerService } from '../../../services/customer.service';
import { Customer } from '../../../models/customer.model';

@Component({
  selector: 'app-customer-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatCheckboxModule
  ],
  templateUrl: './customer-form.component.html',
  styleUrl: './customer-form.component.scss'
})
export class CustomerFormComponent implements OnInit {
  customerForm: FormGroup;
  isEditMode = false;

  constructor(
    private fb: FormBuilder,
    private customerService: CustomerService,
    private dialogRef: MatDialogRef<CustomerFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Customer
  ) {
    this.customerForm = this.fb.group({
      companyName: ['', Validators.required],
      name: [''],
      phone: [''],
      email: [''],
      howFoundUs: [''],
      notes: [''],
      contacts: this.fb.array([])
    });
  }

  ngOnInit(): void {
    
    if (this.data) {
      this.isEditMode = true;
      this.customerForm.patchValue(this.data);
      
      // Load existing contacts
      if (this.data.contacts && this.data.contacts.length > 0) {
        this.data.contacts.forEach(contact => {
          this.addContact(contact);
        });
      }
    }
    
    // Add at least one contact field if none exist
    if (this.contacts.length === 0) {
      this.addContact();
    }
  }

  get contacts(): FormArray {
    return this.customerForm.get('contacts') as FormArray;
  }

  createContactFormGroup(contact?: any): FormGroup {
    return this.fb.group({
      name: [contact?.name || '', Validators.required],
      phone: [contact?.phone || '', Validators.required],
      email: [contact?.email || ''],
      isPrimary: [contact?.isPrimary || false]
    });
  }

  addContact(contact?: any): void {
    this.contacts.push(this.createContactFormGroup(contact));
  }

  removeContact(index: number): void {
    if (this.contacts.length > 1) {
      this.contacts.removeAt(index);
    }
  }

  onSubmit(): void {
    if (this.customerForm.valid) {
      const customerData = {
        ...this.customerForm.value,
        // Keep backwards compatibility - set first contact as main fields
        name: this.contacts.at(0)?.value.name || '',
        phone: this.contacts.at(0)?.value.phone || '',
        email: this.contacts.at(0)?.value.email || ''
      };
      
      if (this.isEditMode) {
        this.customerService.update(this.data.id, customerData).subscribe(() => {
          this.dialogRef.close(true);
        });
      } else {
        this.customerService.create(customerData).subscribe(() => {
          this.dialogRef.close(true);
        });
      }
    }
  }

  close(): void {
    this.dialogRef.close();
  }
}
