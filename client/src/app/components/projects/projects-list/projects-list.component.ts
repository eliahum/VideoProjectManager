import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatChipsModule } from '@angular/material/chips';
import { MatCardModule } from '@angular/material/card';
import { ProjectService } from '../../../services/project.service';
import { Project } from '../../../models/project.model';
import { ProjectFormComponent } from '../project-form/project-form.component';

@Component({
  selector: 'app-projects-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatChipsModule,
    MatCardModule
  ],
  templateUrl: './projects-list.component.html',
  styleUrl: './projects-list.component.scss'
})
export class ProjectsListComponent implements OnInit {
  projects: Project[] = [];
  displayedColumns: string[] = ['customerName', 'projectType', 'currentStage', 'currentMilestone', 'actions'];

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
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadProjects();
  }

  loadProjects(): void {
    this.projectService.getAll().subscribe(response => {
      if (response.isSuccess && response.data) {
        this.projects = [...response.data];
        this.cdr.detectChanges();
      } else {
        console.error('Failed to load projects:', response.errorText);
      }
    });
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
    if (confirm('האם אתה בטוח שברצונך למחוק פרוייקט זה?')) {
      this.projectService.delete(id).subscribe(response => {
        if (response.isSuccess) {
          this.loadProjects();
        } else {
          alert('שגיאה במחיקת פרוייקט: ' + (response.errorText || 'Unknown error'));
        }
      });
    }
  }
}
