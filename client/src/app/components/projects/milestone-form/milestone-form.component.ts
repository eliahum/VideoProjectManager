import { Component, Inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';
import { ProjectService } from '../../../services/project.service';
import { SupplierService } from '../../../services/supplier.service';
import { MessageDialogService } from '../../../services/message-dialog.service';
import { Milestone, MilestoneSupplier } from '../../../models/project.model';
import { Supplier } from '../../../models/supplier.model';
import { convertDateToUTC } from '../../../utils/date.utils';

@Component({
  selector: 'app-milestone-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    MatListModule,
    MatCheckboxModule,
    MatCardModule
  ],
  templateUrl: './milestone-form.component.html',
  styleUrl: './milestone-form.component.scss'
})
export class MilestoneFormComponent implements OnInit {
  milestoneForm: FormGroup;
  availableSuppliers: Supplier[] = [];
  milestoneStatuses = ['לפני התחלה', 'בעבודה', 'אצל הלקוח', 'הושלם'];
  isEditMode: boolean = false;

  constructor(
    private fb: FormBuilder,
    private projectService: ProjectService,
    private supplierService: SupplierService,
    private messageDialogService: MessageDialogService,
    private dialogRef: MatDialogRef<MilestoneFormComponent>,
    private cdr: ChangeDetectorRef,
    @Inject(MAT_DIALOG_DATA) public data: { 
      projectId: string, 
      stageName: string,
      stageNumber: number,
      milestone: Milestone | null
    }
  ) {
    this.isEditMode = !!this.data.milestone;
    this.milestoneForm = this.fb.group({
      name: ['', Validators.required],
      documentReference: [''],
      date: [null],
      status: ['לפני התחלה', Validators.required],
      isUrgent: [false],
      suppliers: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.supplierService.getAll().subscribe(response => {
      if (response.isSuccess && response.data) {
        this.availableSuppliers = response.data;
        this.cdr.detectChanges();
      }
    });
    
    if (this.data.milestone) {
      this.milestoneForm.patchValue({
        name: this.data.milestone.name,
        documentReference: this.data.milestone.documentReference,
        date: this.data.milestone.date,
        status: this.data.milestone.status,
        isUrgent: this.data.milestone.isUrgent || false
      });

      // Load existing suppliers
      this.data.milestone.suppliers.forEach(supplier => {
        this.addSupplier(supplier);
      });
    }
  }

  get suppliers(): FormArray {
    return this.milestoneForm.get('suppliers') as FormArray;
  }

  addSupplier(existing?: MilestoneSupplier): void {
    const supplierGroup = this.fb.group({
      supplierId: [existing?.supplierId || '', Validators.required],
      supplierName: [existing?.supplierName || ''],
      amount: [existing?.amount || 0, [Validators.required, Validators.min(0)]],
      isPaid: [existing?.isPaid || false],
      date: [existing?.date || null]
    });

    // Update supplier name when supplier is selected
    supplierGroup.get('supplierId')?.valueChanges.subscribe(supplierId => {
      const supplier = this.availableSuppliers.find(s => s.id === supplierId);
      if (supplier) {
        supplierGroup.patchValue({ supplierName: supplier.name });
      }
      this.cdr.detectChanges();
    });

    // Trigger change detection when amount changes
    supplierGroup.get('amount')?.valueChanges.subscribe(() => {
      this.cdr.detectChanges();
    });

    this.suppliers.push(supplierGroup);
    this.cdr.detectChanges();
  }

  togglePaid(index: number): void {
    const supplier = this.suppliers.at(index);
    const currentValue = supplier.get('isPaid')?.value;
    const newValue = !currentValue;
    
    const statusText = newValue ? 'שולם' : 'לא שולם';
    const supplierName = supplier.get('supplierName')?.value || 'ספק';
    
    this.messageDialogService.confirm(
      `האם אתה בטוח שברצונך לשנות את הסטטוס של ${supplierName} ל${statusText}?`,
      'אישור שינוי סטטוס'
    ).subscribe((result: 'yes' | 'no') => {
      if (result === 'yes') {
        supplier.patchValue({ isPaid: newValue });
        supplier.markAsDirty();
        console.log('Toggle paid:', { index, currentValue, newValue, formValue: supplier.get('isPaid')?.value });
      }
    });
  }

  removeSupplier(index: number): void {
    this.suppliers.removeAt(index);
  }

  get isFormValid(): boolean {
    // Check basic form fields
    const nameValid = this.milestoneForm.get('name')?.valid ?? false;
    const statusValid = this.milestoneForm.get('status')?.valid ?? false;
    
    // If there are suppliers, all must have a selected supplier and valid amount
    if (this.suppliers.length > 0) {
      const allSuppliersValid = this.suppliers.controls.every(supplier => {
        const hasSupplier = !!supplier.get('supplierId')?.value;
        const hasAmount = supplier.get('amount')?.valid ?? false;
        return hasSupplier && hasAmount;
      });
      return nameValid && statusValid && allSuppliersValid;
    }
    
    return nameValid && statusValid;
  }

  onSubmit(): void {
    if (this.milestoneForm.valid) {
      const suppliers = this.milestoneForm.value.suppliers.map((s: any) => ({
        supplierId: s.supplierId,
        supplierName: s.supplierName,
        amount: s.amount,
        isPaid: s.isPaid || false,
        date: convertDateToUTC(s.date)
      }));

      const milestoneData = {
        name: this.milestoneForm.value.name,
        documentReference: this.milestoneForm.value.documentReference,
        date: convertDateToUTC(this.milestoneForm.value.date),
        statusNumber: this.getStatusNumber(this.milestoneForm.value.status),
        isUrgent: this.milestoneForm.value.isUrgent || false,
        suppliers: suppliers
      };

      console.log('Saving milestone data:', milestoneData);

      if (this.isEditMode && this.data.milestone) {
        // עדכון מילסטון קיים
        this.projectService.updateMilestone(
          this.data.projectId,
          this.data.milestone.stageNumber!,
          this.data.milestone.milestoneId,
          milestoneData
        ).subscribe(updateResponse => {
          if (updateResponse.isSuccess) {
            this.dialogRef.close(true);
          } else {
            this.messageDialogService.showError(
              updateResponse.errorText || 'Unknown error',
              'שגיאה בעדכון milestone'
            );
          }
        });
      } else {
        // יצירת מילסטון חדש
        this.projectService.createMilestone(
          this.data.projectId,
          this.data.stageNumber,
          milestoneData
        ).subscribe(createResponse => {
          if (createResponse.isSuccess) {
            this.dialogRef.close(true);
          } else {
            this.messageDialogService.showError(
              createResponse.errorText || 'Unknown error',
              'שגיאה ביצירת milestone'
            );
          }
        });
      }
    }
  }

  private getStatusNumber(statusText: string): number {
    const statusMap: { [key: string]: number } = {
      'לפני התחלה': 1,
      'בעבודה': 2,
      'אצל הלקוח': 3,
      'הושלם': 4
    };
    return statusMap[statusText] || 1;
  }

  close(): void {
    this.dialogRef.close();
  }
}
