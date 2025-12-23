import { Component, OnInit } from '@angular/core';
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

  constructor(private projectService: ProjectService) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.projectService.getActiveProjects().subscribe(response => {
      if (response.isSuccess && response.data) {
        this.activeProjects = [...response.data];
        this.projectStats = this.activeProjects.map(project => ({
          project,
          currentMilestone: this.getCurrentMilestone(project)
        }));
      } else {
        console.error('Failed to load active projects:', response.errorText);
      }
    });
  }

  getCurrentMilestone(project: Project): Milestone | null {
    const currentStage = project.stages.find(s => s.name === project.currentStage);
    if (!currentStage) return null;

    // אם יש currentMilestoneId, נחפש אותה
    if (project.currentMilestoneId) {
      const found = currentStage.milestones.find(m => m.id === project.currentMilestoneId);
      if (found) return found;
    }
    // אחרת נחזיר את הראשונה שלא הושלמה
    return currentStage.milestones.find(m => m.status !== 'הושלם') || null;
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
}
