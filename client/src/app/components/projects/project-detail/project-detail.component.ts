    // ...existing code...
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { ProjectService } from '../../../services/project.service';
import { Project, ProjectStage, Stage, Milestone, MilestoneStatus } from '../../../models/project.model';
import { MilestoneFormComponent } from '../milestone-form/milestone-form.component';

@Component({
  selector: 'app-project-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatTabsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatDialogModule,
    MatExpansionModule
  ],
  templateUrl: './project-detail.component.html',
  styleUrl: './project-detail.component.scss'
})
export class ProjectDetailComponent implements OnInit {
  project: Project | undefined;
  selectedTabIndex = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private projectService: ProjectService,
    private dialog: MatDialog
  ) {}

  setCurrentMilestone(milestone: Milestone): void {
    if (!this.project) return;
    this.projectService.update(this.project.id, { currentMilestoneId: milestone.id }).subscribe(() => {
      this.reloadProject();
    });
  }

  ngOnInit(): void {
    const projectId = this.route.snapshot.paramMap.get('id');
    if (projectId) {
      this.projectService.getById(projectId).subscribe(project => {
        if (!project) {
          this.router.navigate(['/projects']);
        } else {
          this.project = project;
          // Set tab index based on current stage
          this.selectedTabIndex = this.getTabIndex(this.project.currentStage);
        }
      });
    }
  }

  getTabIndex(stage: ProjectStage): number {
    switch (stage) {
      case ProjectStage.PRE: return 0;
      case ProjectStage.PRODUCTION: return 1;
      case ProjectStage.POST: return 2;
      default: return 0;
    }
  }

  openMilestoneForm(stage: Stage, milestone: Milestone): void {
    if (!this.project) return;

    const dialogRef = this.dialog.open(MilestoneFormComponent, {
      width: '700px',
      data: { 
        projectId: this.project.id, 
        stageName: stage.name, 
        milestone 
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.reloadProject();
      }
    });
  }

  reloadProject(): void {
    if (this.project) {
      this.projectService.getById(this.project.id).subscribe(project => {
        if (project) {
          this.project = project;
        }
      });
    }
  }

  getMilestoneStatusClass(status: MilestoneStatus): string {
    switch (status) {
      case MilestoneStatus.BEFORE_START: return 'status-before';
      case MilestoneStatus.WORKING: return 'status-working';
      case MilestoneStatus.WITH_CLIENT: return 'status-client';
      case MilestoneStatus.COMPLETED: return 'status-completed';
      default: return '';
    }
  }

  changeStage(stage: ProjectStage): void {
    if (!this.project) return;
    if (confirm(`האם לעבור לשלב ${stage}?`)) {
      this.projectService.update(this.project.id, { currentStage: stage });
      this.reloadProject();
    }
  }

  goBack(): void {
    this.router.navigate(['/projects']);
  }
}
