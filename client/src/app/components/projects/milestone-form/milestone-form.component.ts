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
import { Milestone, MilestoneStatus, ProjectStage, MilestoneSupplier } from '../../../models/project.model';
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
  milestoneStatuses = Object.values(MilestoneStatus);

  constructor(
    private fb: FormBuilder,
    private projectService: ProjectService,
    private supplierService: SupplierService,
    private dialogRef: MatDialogRef<MilestoneFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { 
      projectId: string, 
      stageName: ProjectStage, 
      milestone: Milestone 
    }
  ) {
    this.milestoneForm = this.fb.group({
      documentReference: [''],
      date: [null],
      status: [MilestoneStatus.BEFORE_START, Validators.required],
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
    if (this.milestoneForm.valid) {
      const milestoneData = this.milestoneForm.value;
      
      // עדכון המילסטון דרך הפרויקט
      this.projectService.getById(this.data.projectId).subscribe(project => {
        if (project) {
          const stage = project.stages.find(s => s.name === this.data.stageName);
          if (stage) {
            const milestone = stage.milestones.find(m => m.id === this.data.milestone.id);
            if (milestone) {
              Object.assign(milestone, milestoneData);
              this.projectService.update(project.id, project).subscribe(() => {
                this.dialogRef.close(true);
              });
            }
          }
        }
      });
    }
  }

  close(): void {
    this.dialogRef.close();
  }
}
