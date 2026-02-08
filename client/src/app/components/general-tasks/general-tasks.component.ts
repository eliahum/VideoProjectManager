import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatChipsModule } from '@angular/material/chips';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { GeneralTaskService } from '../../services/general-task.service';
import { GeneralTaskStatusService } from '../../services/general-task-status.service';
import { MessageDialogService } from '../../services/message-dialog.service';
import { GeneralTask } from '../../models/general-task.model';
import { GeneralTaskStatus } from '../../models/general-task-status.model';
import { GeneralTaskFormComponent } from './general-task-form/general-task-form.component';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-general-tasks',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatChipsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatTooltipModule
  ],
  templateUrl: './general-tasks.component.html',
  styleUrl: './general-tasks.component.scss'
})
export class GeneralTasksComponent implements OnInit {
  tasks: GeneralTask[] = [];
  allTasks: GeneralTask[] = [];
  filteredTasks: GeneralTask[] = [];
  paginatedTasks: GeneralTask[] = [];
  statuses: GeneralTaskStatus[] = [];
  searchText: string = '';
  displayedColumns: string[] = ['taskNumber', 'name', 'statusNumber', 'date', 'notes', 'actions'];
  pageSize: number = 10;
  pageIndex: number = 0;
  pageSizeOptions: number[] = [5, 10, 25, 50];
  isLoading: boolean = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private taskService: GeneralTaskService,
    private statusService: GeneralTaskStatusService,
    private messageDialogService: MessageDialogService,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadStatuses();
    this.loadTasks();
  }

  loadStatuses(): void {
    this.statusService.getAll().subscribe({
      next: (response) => {
        if (response.isSuccess && response.data) {
          this.statuses = response.data;
          this.cdr.detectChanges();
        }
      },
      error: (error) => {
        console.error('Error loading statuses:', error);
      }
    });
  }

  loadTasks(): void {
    this.isLoading = true;
    this.taskService.getAll()
      .pipe(finalize(() => {
        this.isLoading = false;
        this.cdr.detectChanges();
      }))
      .subscribe({
        next: (response) => {
          if (response.isSuccess && response.data) {
            this.allTasks = [...response.data];
            this.applyFilter();
            this.cdr.detectChanges();
          } else {
            console.error('Failed to load tasks:', response.errorText);
            this.messageDialogService.showError('שגיאה בטעינת משימות: ' + (response.errorText || 'Unknown error'));
          }
        },
        error: (error) => {
          console.error('Error loading tasks:', error);
          this.messageDialogService.showError('שגיאה בטעינת משימות');
        }
      });
  }

  applyFilter(): void {
    const text = this.searchText ? this.searchText.trim().toLowerCase() : '';
    if (!text) {
      this.filteredTasks = [...this.allTasks];
    } else {
      this.filteredTasks = this.allTasks.filter(task => {
        return Object.values(task).some(val =>
          val && val.toString().toLowerCase().includes(text)
        );
      });
    }
    this.pageIndex = 0;
    this.updatePaginatedTasks();
  }

  updatePaginatedTasks(): void {
    const startIndex = this.pageIndex * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedTasks = this.filteredTasks.slice(startIndex, endIndex);
  }

  onPageChange(event: any): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updatePaginatedTasks();
  }

  get totalItems(): number {
    return this.filteredTasks.length;
  }

  clearSearch(): void {
    this.searchText = '';
    this.applyFilter();
  }

  openTaskForm(task?: GeneralTask): void {
    const isMobile = window.innerWidth <= 768;
    const dialogRef = this.dialog.open(GeneralTaskFormComponent, {
      width: isMobile ? '95vw' : '600px',
      maxWidth: isMobile ? '95vw' : '600px',
      disableClose: true,
      data: { task, statuses: this.statuses }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadTasks();
      }
    });
  }

  deleteTask(id: string): void {
    this.messageDialogService.confirm('האם אתה בטוח שברצונך למחוק משימה זו?', 'אישור מחיקה').subscribe((result: 'yes' | 'no') => {
      if (result === 'yes') {
        this.taskService.delete(id).subscribe(response => {
          if (response.isSuccess) {
            this.messageDialogService.showSuccess('משימה נמחקה בהצלחה');
            this.loadTasks();
          } else {
            console.error('Failed to delete task:', response.errorText);
            this.messageDialogService.showError('שגיאה במחיקת משימה: ' + (response.errorText || 'Unknown error'));
          }
        });
      }
    });
  }

  getStatusName(statusNumber: number): string {
    const status = this.statuses.find(s => s.statusNumber === statusNumber);
    return status ? status.name : `סטטוס ${statusNumber}`;
  }

  getStatusClass(statusNumber: number): string {
    const status = this.statuses.find(s => s.statusNumber === statusNumber);
    if (status?.isFinal) return 'status-final';
    return `status-${statusNumber}`;
  }
}
