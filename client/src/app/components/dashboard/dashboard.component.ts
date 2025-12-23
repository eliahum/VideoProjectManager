import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { ProjectService } from '../../services/project.service';
import { Project, Milestone } from '../../models/project.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  activeProjects: Project[] = [];
  projectStats: { project: Project, currentMilestone: Milestone | null }[] = [];

  constructor(
    private projectService: ProjectService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.projectService.getActiveProjects().subscribe({
      next: (response) => {
        console.log('Dashboard response:', response);
        if (response.isSuccess && response.data) {
          this.activeProjects = [...response.data];
          console.log('Active projects:', this.activeProjects);
          this.projectStats = this.activeProjects.map(project => ({
            project,
            currentMilestone: this.getCurrentMilestone(project)
          }));
          console.log('Project stats:', this.projectStats);
          this.cdr.detectChanges();
        } else {
          console.error('Failed to load active projects:', response.errorText);
        }
      },
      error: (error) => {
        console.error('Error loading projects:', error);
      }
    });
  }

  getCurrentMilestone(project: Project): Milestone | null {
    // מוצא את השלב הנוכחי לפי מספר השלב
    const currentStage = project.stages.find(s => s.stageNumber === project.currentStageNumber);
    if (!currentStage || !currentStage.milestones || currentStage.milestones.length === 0) {
      return null;
    }

    // אם יש currentMilestoneId, נחפש אותה
    if (project.currentMilestoneId) {
      const found = currentStage.milestones.find(m => m.milestoneId === project.currentMilestoneId);
      if (found) return found;
    }
    
    // אחרת נחזיר את הראשונה שלא הושלמה (סטטוס לא 4)
    const inProgress = currentStage.milestones.find(m => m.statusNumber && m.statusNumber < 4);
    if (inProgress) return inProgress;
    
    // אם הכל הושלם, נחזיר את האחרונה
    return currentStage.milestones[currentStage.milestones.length - 1] || null;
  }

  getMilestoneStatusClass(status?: string): string {
    if (!status) return '';
    switch (status) {
      case 'לפני התחלה': return 'status-before';
      case 'בעבודה': return 'status-working';
      case 'אצל הלקוח': return 'status-client';
      case 'הושלם': return 'status-completed';
      default: return '';
    }
  }

  getTotalSuppliersAmount(project: Project): number {
    let total = 0;
    project.stages.forEach(stage => {
      stage.milestones.forEach(milestone => {
        milestone.suppliers.forEach(supplier => {
          total += supplier.amount || 0;
        });
      });
    });
    return total;
  }
}
