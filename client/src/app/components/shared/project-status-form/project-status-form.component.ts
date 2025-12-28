import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { ProjectStatus } from '../../../models/project-status.model';

@Component({
  selector: 'app-project-status-form',
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
  templateUrl: './project-status-form.component.html',
  styleUrl: './project-status-form.component.scss'
})
export class ProjectStatusFormComponent implements OnInit {
  statusForm!: FormGroup;
  isEditMode: boolean = false;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ProjectStatusFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ProjectStatus | null
  ) {}

  ngOnInit(): void {
    this.isEditMode = !!this.data;
    
    this.statusForm = this.fb.group({
      name: [this.data?.name || '', Validators.required],
      isFinal: [this.data?.isFinal || false],
      isPause: [this.data?.isPause || false],
      isVisible: [this.data?.isVisible !== undefined ? this.data.isVisible : true]
    });
  }

  onSubmit(): void {
    if (this.statusForm.valid) {
      this.dialogRef.close(this.statusForm.value);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
