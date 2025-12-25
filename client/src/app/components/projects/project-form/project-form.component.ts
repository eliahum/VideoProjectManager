import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ProjectService } from '../../../services/project.service';
import { CustomerService } from '../../../services/customer.service';
import { Project } from '../../../models/project.model';
import { Customer } from '../../../models/customer.model';

@Component({
  selector: 'app-project-form',
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
    MatCheckboxModule
  ],
  templateUrl: './project-form.component.html',
  styleUrl: './project-form.component.scss'
})
export class ProjectFormComponent implements OnInit {
  projectForm: FormGroup;
  isEditMode = false;
  customers: Customer[] = [];
  projectStages = ['פרה', 'פרודקשן', 'פוסט'];

  constructor(
    private fb: FormBuilder,
    private projectService: ProjectService,
    private customerService: CustomerService,
    private dialogRef: MatDialogRef<ProjectFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Project
  ) {
    this.projectForm = this.fb.group({
      customerId: ['', Validators.required],
      projectName: ['', Validators.required],
      currentStage: ['פרה', Validators.required],
      initializeAllStages: [false]
    });
  }

  ngOnInit(): void {
    this.customerService.getAll().subscribe(response => {
      if (response.isSuccess && response.data) {
        this.customers = response.data;
      } else {
        console.error('Failed to load customers:', response.errorText);
        alert('שגיאה בטעינת לקוחות: ' + (response.errorText || 'Unknown error'));
      }
    });
    
    if (this.data) {
      this.isEditMode = true;
      this.projectForm.patchValue(this.data);
    }
  }

  onSubmit(): void {
    if (this.projectForm.valid) {
      const projectData = this.projectForm.value;
      const customer = this.customers.find(c => c.id === projectData.customerId);
      
      if (!customer) {
        alert('לקוח לא נמצא');
        return;
      }

      const fullProjectData = {
        ...projectData,
        customerName: customer.name,
        stages: [],
        initializeAllStages: projectData.initializeAllStages
      };
      
      if (this.isEditMode) {
        this.projectService.update(this.data.id, fullProjectData).subscribe(response => {
          if (response.isSuccess) {
            this.dialogRef.close(true);
          } else {
            alert('שגיאה בעדכון פרוייקט: ' + (response.errorText || 'Unknown error'));
          }
        });
      } else {
        this.projectService.create(fullProjectData).subscribe(response => {
          if (response.isSuccess) {
            this.dialogRef.close(true);
          } else {
            alert('שגיאה ביצירת פרוייקט: ' + (response.errorText || 'Unknown error'));
          }
        });
      }
    }
  }

  close(): void {
    this.dialogRef.close();
  }
}
