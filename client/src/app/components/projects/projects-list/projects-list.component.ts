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
import { ProjectService } from '../../../services/project.service';
import { MessageDialogService } from '../../../services/message-dialog.service';
import { Project } from '../../../models/project.model';
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
    MatInputModule
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
  displayedColumns: string[] = ['customerName', 'projectType', 'currentStage', 'currentMilestone', 'actions'];
  isLoading: boolean = false;
  pageSize: number = 10;
  pageIndex: number = 0;
  pageSizeOptions: number[] = [5, 10, 25, 50];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  getCurrentMilestoneName(project: Project): string {
    if (!project.currentMilestoneId) return '-';
    const stage = project.stages.find(s => s.stageNumber === project.currentStageNumber);
    if (!stage) return '-';
    const milestone = stage.milestones.find(m => m.milestoneId === project.currentMilestoneId);
    return milestone ? milestone.name : '-';
  }

  constructor(
    private projectService: ProjectService,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef,
    private messageDialogService: MessageDialogService
  ) {}

  ngOnInit(): void {
    this.loadProjects();
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
    if (!text) {
      this.filteredProjects = [...this.allProjects];
    } else {
      this.filteredProjects = this.allProjects.filter(project => {
        return Object.values(project).some(val =>
          val && val.toString().toLowerCase().includes(text)
        );
      });
    }
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
      data: project
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
