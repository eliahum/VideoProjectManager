import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatChipsModule } from '@angular/material/chips';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ProjectService } from '../../../services/project.service';
import { ProjectStatusService } from '../../../services/project-status.service';
import { MessageDialogService } from '../../../services/message-dialog.service';
import { Project } from '../../../models/project.model';
import { ProjectStatus } from '../../../models/project-status.model';
import { ProjectFormComponent } from '../project-form/project-form.component';

@Component({
  selector: 'app-projects-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatChipsModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule
  ],
  templateUrl: './projects-list.component.html',
  styleUrl: './projects-list.component.scss'
})
export class ProjectsListComponent implements OnInit {
  projects: Project[] = [];
  allProjects: Project[] = [];
  filteredProjects: Project[] = [];
  paginatedProjects: Project[] = [];
  searchText: string = '';
  displayedColumns: string[] = ['projectName','customerName', 'status', 'stageMilestone', 'suppliersPayment', 'paidAmount', 'profit', 'actions'];
  isLoading: boolean = false;
  pageSize: number = 10;
  pageIndex: number = 0;
  pageSizeOptions: number[] = [5, 10, 25, 50];
  Math = Math;
  projectStatuses: ProjectStatus[] = [];
  activeStatuses: ProjectStatus[] = []; // סטטוסים שאינם סופיים
  selectedStatusNumbers: number[] = []; // סטטוסים נבחרים לפילטור

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  getStatusName(statusNumber: number): string {
    const status = this.projectStatuses.find(s => s.statusNumber === statusNumber);
    return status ? status.name : '-';
  }

  getCurrentMilestoneName(project: Project): string {
    if (!project.currentMilestoneId) return '-';
    const stage = project.stages.find(s => s.stageNumber === project.currentStageNumber);
    if (!stage) return '-';
    const milestone = stage.milestones.find(m => m.milestoneId === project.currentMilestoneId);
    return milestone ? milestone.name : '-';
  }

  getTotalSuppliersAmount(project: Project): number {
    let total = 0;
    project.stages?.forEach(stage => {
      stage.milestones?.forEach(milestone => {
        milestone.suppliers?.forEach(supplier => {
          total += supplier.amount || 0;
        });
      });
    });
    return total;
  }

  getTotalSuppliersPaid(project: Project): number {
    let total = 0;
    project.stages?.forEach(stage => {
      stage.milestones?.forEach(milestone => {
        milestone.suppliers?.forEach(supplier => {
          if (supplier.isPaid) {
            total += supplier.amount || 0;
          }
        });
      });
    });
    return total;
  }

  getTotalSuppliersUnpaid(project: Project): number {
    let total = 0;
    project.stages?.forEach(stage => {
      stage.milestones?.forEach(milestone => {
        milestone.suppliers?.forEach(supplier => {
          if (!supplier.isPaid) {
            total += supplier.amount || 0;
          }
        });
      });
    });
    return total;
  }

  getProfit(project: Project): number {
    const paidAmount = project.paidAmount || 0;
    const suppliersTotal = this.getTotalSuppliersAmount(project);
    return paidAmount - suppliersTotal;
  }

  constructor(
    private projectService: ProjectService,
    private projectStatusService: ProjectStatusService,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef,
    private messageDialogService: MessageDialogService
  ) {}

  ngOnInit(): void {
    this.loadProjectStatuses();
    this.loadProjects();
  }

  loadProjectStatuses(): void {
    this.projectStatusService.getAll().subscribe({
      next: (response) => {
        if (response.isSuccess && response.data) {
          this.projectStatuses = response.data;
          // סטטוסים פעילים (לא סופיים) בלבד
          this.activeStatuses = response.data.filter(s => !s.isFinal);
          // בחירה אוטומטית של כל הסטטוסים הפעילים
          this.selectedStatusNumbers = this.activeStatuses.map(s => s.statusNumber);
        }
      },
      error: (err) => {
        console.error('Error loading project statuses:', err);
      }
    });
  }

  toggleStatusFilter(statusNumber: number): void {
    const index = this.selectedStatusNumbers.indexOf(statusNumber);
    if (index > -1) {
      this.selectedStatusNumbers.splice(index, 1);
    } else {
      this.selectedStatusNumbers.push(statusNumber);
    }
    this.applyFilter();
  }

  isStatusSelected(statusNumber: number): boolean {
    return this.selectedStatusNumbers.includes(statusNumber);
  }

  loadProjects(): void {
    this.isLoading = true;
    this.projectService.getAll().subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.isSuccess && response.data) {
          this.allProjects = [...response.data];
          this.applyFilter();
          this.cdr.detectChanges();
        } else {
          this.messageDialogService.showError('שגיאה בטעינת פרויקטים: ' + (response.errorText || 'Unknown error'));
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.messageDialogService.showError('שגיאה בטעינת פרויקטים');
      }
    });
  }

  applyFilter(): void {
    const text = this.searchText ? this.searchText.trim().toLowerCase() : '';
    
    // פילטור לפי סטטוסים נבחרים
    let filtered = this.allProjects.filter(project => {
      return this.selectedStatusNumbers.includes(project.statusNumber);
    });

    // פילטור לפי טקסט חיפוש
    if (text) {
      filtered = filtered.filter(project => {
        return Object.values(project).some(val =>
          val && val.toString().toLowerCase().includes(text)
        );
      });
    }

    this.filteredProjects = filtered;
    this.projects = this.filteredProjects;
    this.pageIndex = 0;
    this.updatePaginatedProjects();
  }

  clearSearch(): void {
    this.searchText = '';
    this.applyFilter();
  }

  updatePaginatedProjects(): void {
    const startIndex = this.pageIndex * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedProjects = this.projects.slice(startIndex, endIndex);
  }

  onPageChange(event: any): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updatePaginatedProjects();
  }

  get totalItems(): number {
    return this.projects.length;
  }

  openProjectForm(project?: Project): void {
    const isMobile = window.innerWidth <= 768;
    const dialogRef = this.dialog.open(ProjectFormComponent, {
      width: isMobile ? '95vw' : '600px',
      maxWidth: isMobile ? '95vw' : '600px',
      data: project,
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadProjects();
      }
    });
  }

  deleteProject(id: string): void {
    this.messageDialogService.confirm('האם אתה בטוח שברצונך למחוק פרוייקט זה?').subscribe((result: 'yes' | 'no') => {
      if (result === 'yes') {
        this.isLoading = true;
        this.projectService.delete(id).subscribe({
          next: (response) => {
            this.isLoading = false;
            if (response.isSuccess) {
              this.messageDialogService.showSuccess('הפרוייקט נמחק בהצלחה');
              this.loadProjects();
            } else {
              this.messageDialogService.showError('שגיאה במחיקת פרוייקט: ' + (response.errorText || 'Unknown error'));
            }
          },
          error: (err) => {
            this.isLoading = false;
            this.messageDialogService.showError('שגיאה במחיקת פרוייקט');
          }
        });
      }
    });
  }
}
