import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { ProjectService } from '../../../services/project.service';
import { CustomerService } from '../../../services/customer.service';
import { Project, ProjectStage } from '../../../models/project.model';
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
    MatIconModule
  ],
  templateUrl: './project-form.component.html',
  styleUrl: './project-form.component.scss'
})
export class ProjectFormComponent implements OnInit {
  projectForm: FormGroup;
  isEditMode = false;
  customers: Customer[] = [];
  projectStages = Object.values(ProjectStage);

  constructor(
    private fb: FormBuilder,
    private projectService: ProjectService,
    private customerService: CustomerService,
    private dialogRef: MatDialogRef<ProjectFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Project
  ) {
    this.projectForm = this.fb.group({
      customerId: ['', Validators.required],
      projectType: ['', Validators.required],
      currentStage: [ProjectStage.PRE, Validators.required]
    });
  }

  ngOnInit(): void {
    this.customerService.getAll().subscribe(customers => {
      this.customers = customers;
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
        stages: []
      };
      
      if (this.isEditMode) {
        this.projectService.update(this.data.id, fullProjectData).subscribe(() => {
          this.dialogRef.close(true);
        });
      } else {
        this.projectService.create(fullProjectData).subscribe(() => {
          this.dialogRef.close(true);
        });
      }
    }
  }

  close(): void {
    this.dialogRef.close();
  }
}
