import { Component, Inject, OnInit } from '@angular/core';
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
import { ProjectService } from '../../../services/project.service';
import { SupplierService } from '../../../services/supplier.service';
import { MessageDialogService } from '../../../services/message-dialog.service';
import { Milestone, MilestoneSupplier } from '../../../models/project.model';
import { Supplier } from '../../../models/supplier.model';

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
    MatListModule
  ],
  templateUrl: './milestone-form.component.html',
  styleUrl: './milestone-form.component.scss'
})
export class MilestoneFormComponent implements OnInit {
  milestoneForm: FormGroup;
  availableSuppliers: Supplier[] = [];
  milestoneStatuses = ['לפני התחלה', 'בעבודה', 'אצל הלקוח', 'הושלם'];

  constructor(
    private fb: FormBuilder,
    private projectService: ProjectService,
    private supplierService: SupplierService,
    private messageDialogService: MessageDialogService,
    private dialogRef: MatDialogRef<MilestoneFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { 
      projectId: string, 
      stageName: string, 
      milestone: Milestone 
    }
  ) {
    this.milestoneForm = this.fb.group({
      documentReference: [''],
      date: [null],
      status: ['לפני התחלה', Validators.required],
      suppliers: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.supplierService.getAll().subscribe(response => {
      if (response.isSuccess && response.data) {
        this.availableSuppliers = response.data;
      }
    });
    
    if (this.data.milestone) {
      this.milestoneForm.patchValue({
        documentReference: this.data.milestone.documentReference,
        date: this.data.milestone.date,
        status: this.data.milestone.status
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
      amount: [existing?.amount || 0, [Validators.required, Validators.min(0)]]
    });

    // Update supplier name when supplier is selected
    supplierGroup.get('supplierId')?.valueChanges.subscribe(supplierId => {
      const supplier = this.availableSuppliers.find(s => s.id === supplierId);
      if (supplier) {
        supplierGroup.patchValue({ supplierName: supplier.name });
      }
    });

    this.suppliers.push(supplierGroup);
  }

  removeSupplier(index: number): void {
    this.suppliers.removeAt(index);
  }

  onSubmit(): void {
    debugger;
    if (this.milestoneForm.valid) {
      const milestoneData = {
        documentReference: this.milestoneForm.value.documentReference,
        date: this.milestoneForm.value.date,
        statusNumber: this.getStatusNumber(this.milestoneForm.value.status),
        suppliers: this.milestoneForm.value.suppliers
      };

      // עדכון המילסטון דרך ה-endpoint החדש
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
