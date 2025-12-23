import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { SupplierService } from '../../../services/supplier.service';
import { SupplierTypeService } from '../../../services/supplier-type.service';
import { MessageDialogService } from '../../../services/message-dialog.service';
import { Supplier } from '../../../models/supplier.model';
import { SupplierType } from '../../../models/supplier-type.model';

@Component({
  selector: 'app-supplier-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    MatIconModule,
    MatSelectModule
  ],
  templateUrl: './supplier-form.component.html',
  styleUrl: './supplier-form.component.scss'
})
export class SupplierFormComponent implements OnInit {
  supplierForm: FormGroup;
  isEditMode = false;
  supplierTypes: SupplierType[] = [];

  constructor(
    private fb: FormBuilder,
    private supplierService: SupplierService,
    private supplierTypeService: SupplierTypeService,
    private messageDialogService: MessageDialogService,
    private dialogRef: MatDialogRef<SupplierFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Supplier
  ) {
    this.supplierForm = this.fb.group({
      name: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['', Validators.email],
      supplierTypeId: [null],
      accountDetails: ['', Validators.required],
      isPaid: [false],
      notes: ['']
    });
  }

  ngOnInit(): void {
    this.loadSupplierTypes();
    if (this.data) {
      this.isEditMode = true;
      this.supplierForm.patchValue({
        ...this.data,
        supplierTypeId: this.data.supplierType?.id || null
      });
    }
  }

  loadSupplierTypes(): void {
    this.supplierTypeService.getActive().subscribe(response => {
      if (response.isSuccess && response.data) {
        this.supplierTypes = response.data;
      }
    });
  }

  onSubmit(): void {
    if (this.supplierForm.valid) {
      const formValue = this.supplierForm.value;
      
      // Prepare supplier data with correct field name for backend
      const supplierData = {
        name: formValue.name,
        phone: formValue.phone,
        email: formValue.email,
        supplierType: formValue.supplierTypeId || null, // Send as 'supplierType' for backend
        accountDetails: formValue.accountDetails,
        isPaid: formValue.isPaid,
        notes: formValue.notes
      };
      
      if (this.isEditMode) {
        this.supplierService.update(this.data.id, supplierData).subscribe(response => {
          if (response.isSuccess) {
            this.messageDialogService.showSuccess('ספק עודכן בהצלחה!');
            this.dialogRef.close(true);
          } else {
            console.error('Failed to update supplier:', response.errorText);
            this.messageDialogService.showError('שגיאה בעדכון ספק: ' + (response.errorText || 'Unknown error'));
          }
        });
      } else {
        this.supplierService.create(supplierData).subscribe(response => {
          if (response.isSuccess) {
            this.messageDialogService.showSuccess('ספק נוצר בהצלחה!');
            this.dialogRef.close(true);
          } else {
            console.error('Failed to create supplier:', response.errorText);
            this.messageDialogService.showError('שגיאה ביצירת ספק: ' + (response.errorText || 'Unknown error'));
          }
        });
      }
    }
  }

  close(): void {
    this.dialogRef.close();
  }
}
