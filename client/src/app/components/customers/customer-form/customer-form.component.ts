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
      this.customerForm.patchValue({
        companyName: this.data.companyName,
        howFoundUs: this.data.howFoundUs,
        notes: this.data.notes
      });
      
      // Load existing contacts
      if (this.data.contacts && this.data.contacts.length > 0) {
        this.data.contacts.forEach(contact => {
          const contactGroup = this.createContactFormGroup(contact);
          this.contacts.push(contactGroup);
        });
      }
    }
    
    // Add at least one contact field if none exist
    if (this.contacts.length === 0) {
      this.addContact();
    } else {
      // Only ensure one primary if we're not loading existing data
      // or if there's actually a problem
      this.ensureOnePrimary();
    }
  }

  ensureOnePrimary(): void {
    const primaryIndexes: number[] = [];
    
    // Find all contacts marked as primary
    this.contacts.controls.forEach((control, index) => {
      if (control.get('isPrimary')?.value === true) {
        primaryIndexes.push(index);
      }
    });
    
    // If more than one is primary, keep only the first one
    if (primaryIndexes.length > 1) {
      primaryIndexes.slice(1).forEach(index => {
        this.contacts.at(index)?.get('isPrimary')?.patchValue(false);
      });
    }
    
    // If none is primary, mark the first contact as primary
    if (primaryIndexes.length === 0 && this.contacts.length > 0) {
      this.contacts.at(0)?.get('isPrimary')?.patchValue(true);
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
    const newContact = this.createContactFormGroup(contact);
    
    // If this is the first contact, mark it as primary
    if (this.contacts.length === 0) {
      newContact.get('isPrimary')?.setValue(true);
    }
    
    this.contacts.push(newContact);
  }

  removeContact(index: number): void {
    if (this.contacts.length > 1) {
      const wasRemovingPrimary = this.contacts.at(index)?.get('isPrimary')?.value;
      this.contacts.removeAt(index);
      
      // If only one contact remains, mark it as primary
      if (this.contacts.length === 1) {
        this.contacts.at(0)?.get('isPrimary')?.setValue(true);
      } else if (wasRemovingPrimary) {
        // If we removed the primary contact and there are still multiple contacts,
        // mark the first one as primary
        this.contacts.at(0)?.get('isPrimary')?.setValue(true);
      }
    }
  }

  onPrimaryChange(selectedIndex: number): void {
    const isPrimary = this.contacts.at(selectedIndex)?.get('isPrimary')?.value;
    
    // If there's only one contact, it must be primary
    if (this.contacts.length === 1) {
      this.contacts.at(0)?.get('isPrimary')?.setValue(true);
      return;
    }
    
    if (isPrimary) {
      // When a contact is marked as primary, unmark all others
      this.contacts.controls.forEach((control, index) => {
        if (index !== selectedIndex) {
          control.get('isPrimary')?.setValue(false);
        }
      });
    } else {
      // Don't allow unmarking if no other contact is primary
      const hasPrimary = this.contacts.controls.some((control, index) => 
        index !== selectedIndex && control.get('isPrimary')?.value
      );
      
      if (!hasPrimary) {
        // Re-mark this one as primary
        this.contacts.at(selectedIndex)?.get('isPrimary')?.setValue(true);
      }
    }
    
    // Mark form as dirty to enable save
    this.customerForm.markAsDirty();
  }

  onSubmit(): void {
    // Validate that at least one contact is marked as primary
    const hasPrimaryContact = this.contacts.controls.some(control => 
      control.get('isPrimary')?.value === true
    );
    
    if (!hasPrimaryContact) {
      // Auto-mark the first contact as primary if none is selected
      if (this.contacts.length > 0) {
        this.contacts.at(0)?.get('isPrimary')?.setValue(true);
      }
    }
    
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
