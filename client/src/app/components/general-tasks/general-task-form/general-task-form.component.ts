import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { GeneralTaskService } from '../../../services/general-task.service';
import { MessageDialogService } from '../../../services/message-dialog.service';
import { GeneralTask } from '../../../models/general-task.model';
import { GeneralTaskStatus } from '../../../models/general-task-status.model';
import { convertDateToUTC } from '../../../utils/date.utils';

@Component({
  selector: 'app-general-task-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  templateUrl: './general-task-form.component.html',
  styleUrl: './general-task-form.component.scss'
})
export class GeneralTaskFormComponent implements OnInit {
  taskForm: FormGroup;
  isEditMode = false;
  statuses: GeneralTaskStatus[] = [];

  constructor(
    private fb: FormBuilder,
    private taskService: GeneralTaskService,
    private messageDialogService: MessageDialogService,
    private dialogRef: MatDialogRef<GeneralTaskFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { task?: GeneralTask, statuses: GeneralTaskStatus[] }
  ) {
    this.taskForm = this.fb.group({
      name: ['', Validators.required],
      statusNumber: [1, Validators.required],
      date: [null, Validators.required],
      notes: ['']
    });
  }

  ngOnInit(): void {
    this.statuses = this.data.statuses || [];
    if (this.data.task) {
      this.isEditMode = true;
      this.taskForm.patchValue({
        name: this.data.task.name,
        statusNumber: this.data.task.statusNumber,
        date: this.data.task.date ? new Date(this.data.task.date) : null,
        notes: this.data.task.notes || ''
      });
    }
  }

  onSubmit(): void {
    if (this.taskForm.valid) {
      const taskData = {
        ...this.taskForm.value,
        date: convertDateToUTC(this.taskForm.value.date)
      };
      
      if (this.isEditMode) {
        this.taskService.update(this.data.task!._id!, taskData).subscribe(response => {
          if (response.isSuccess) {
            this.messageDialogService.showSuccess('משימה עודכנה בהצלחה!');
            this.dialogRef.close(true);
          } else {
            console.error('Failed to update task:', response.errorText);
            this.messageDialogService.showError('שגיאה בעדכון משימה: ' + (response.errorText || 'Unknown error'));
          }
        });
      } else {
        this.taskService.create(taskData).subscribe(response => {
          if (response.isSuccess) {
            this.messageDialogService.showSuccess('משימה נוספה בהצלחה!');
            this.dialogRef.close(true);
          } else {
            console.error('Failed to create task:', response.errorText);
            this.messageDialogService.showError('שגיאה בהוספת משימה: ' + (response.errorText || 'Unknown error'));
          }
        });
      }
    }
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
