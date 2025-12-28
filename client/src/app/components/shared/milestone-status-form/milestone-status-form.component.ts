import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MilestoneStatus } from '../../../models/milestone-status.model';

@Component({
  selector: 'app-milestone-status-form',
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
  templateUrl: './milestone-status-form.component.html',
  styleUrl: './milestone-status-form.component.scss'
})
export class MilestoneStatusFormComponent implements OnInit {
  statusForm!: FormGroup;
  isEditMode: boolean = false;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<MilestoneStatusFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: MilestoneStatus | null
  ) {}

  ngOnInit(): void {
    this.isEditMode = !!this.data;
    
    this.statusForm = this.fb.group({
      name: [this.data?.name || '', Validators.required],
      isFinal: [this.data?.isFinal || false],
      isEditable: [this.data?.isEditable !== undefined ? this.data.isEditable : true]
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
