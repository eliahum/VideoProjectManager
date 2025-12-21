import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { SupplierService } from '../../../services/supplier.service';
import { Supplier } from '../../../models/supplier.model';

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
    MatIconModule
  ],
  templateUrl: './supplier-form.component.html',
  styleUrl: './supplier-form.component.scss'
})
export class SupplierFormComponent implements OnInit {
  supplierForm: FormGroup;
  isEditMode = false;

  constructor(
    private fb: FormBuilder,
    private supplierService: SupplierService,
    private dialogRef: MatDialogRef<SupplierFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Supplier
  ) {
    this.supplierForm = this.fb.group({
      name: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      accountDetails: ['', Validators.required],
      isPaid: [false],
      notes: ['']
    });
  }

  ngOnInit(): void {
    if (this.data) {
      this.isEditMode = true;
      this.supplierForm.patchValue(this.data);
    }
  }

  onSubmit(): void {
    if (this.supplierForm.valid) {
      const supplierData = this.supplierForm.value;
      
      if (this.isEditMode) {
        this.supplierService.update(this.data.id, supplierData).subscribe(() => {
          this.dialogRef.close(true);
        });
      } else {
        this.supplierService.create(supplierData).subscribe(() => {
          this.dialogRef.close(true);
        });
      }
    }
  }

  close(): void {
    this.dialogRef.close();
  }
}
