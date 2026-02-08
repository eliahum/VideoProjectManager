import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { finalize } from 'rxjs/operators';
import { ProjectService } from '../../services/project.service';
import { LeadService } from '../../services/lead.service';
import { ProjectStatusService } from '../../services/project-status.service';
import { GeneralTaskService } from '../../services/general-task.service';
import { GeneralTaskStatusService } from '../../services/general-task-status.service';
import { Project, Milestone } from '../../models/project.model';
import { ProjectStatus } from '../../models/project-status.model';
import { GeneralTask } from '../../models/general-task.model';
import { GeneralTaskStatus } from '../../models/general-task-status.model';
import { HttpClient } from '@angular/common/http';

interface UrgentMilestoneTask {
  title: string;
  time: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatTooltipModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  activeProjects: Project[] = [];
  projectStats: { project: Project, currentMilestone: Milestone | null }[] = [];
  projectStatuses: ProjectStatus[] = [];
  isLoading = false;
  
  // Dashboard statistics
  totalLeads = 0;
  pendingMilestoneTasks = 0;
  weeklyMeetings = 0;
  
  // Urgent milestone tasks
  urgentMilestoneTasks: UrgentMilestoneTask[] = [];
  
  // Upcoming general tasks
  upcomingTasks: GeneralTask[] = [];
  taskStatuses: GeneralTaskStatus[] = [];

  constructor(
    private projectService: ProjectService,
    private leadService: LeadService,
    private projectStatusService: ProjectStatusService,
    private generalTaskService: GeneralTaskService,
    private generalTaskStatusService: GeneralTaskStatusService,
    private cdr: ChangeDetectorRef
    
  ) {}

  ngOnInit(): void {
    this.loadProjectStatuses();
    this.loadData();
    this.loadLeadsData();
    this.loadTaskStatuses();
    this.loadUpcomingTasks();
  }

  loadData(): void {
    this.isLoading = true;
    this.projectService.getActiveProjects()
      .pipe(
        finalize(() => {
          this.isLoading = false;
          this.cdr.detectChanges();
        })
      )
      .subscribe({
      next: (response) => {
        console.log('Dashboard response:', response);
        if (response.isSuccess && response.data) {
          // סנן רק פרויקטים שהסטטוס שלהם לא סופי ולא בהשהייה
          this.activeProjects = response.data.filter(project => {
            const status = this.projectStatuses.find(s => s.statusNumber === project.statusNumber);
            return status && !status.isFinal && !status.isPause;
          });
          console.log('Active projects:', this.activeProjects);
          this.projectStats = this.activeProjects.map(project => ({
            project,
            currentMilestone: this.getCurrentMilestone(project)
          }));
          
          // Calculate pending milestone tasks from milestones
          this.calculatePendingMilestoneTasks();
          // Refresh urgent milestone tasks from projects
          this.loadUrgentMilestoneTasks();
          
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

  loadLeadsData(): void {
    this.leadService.getAll().subscribe({
      next: (response) => {
        if (response.isSuccess && response.data) {
          // Count leads from today
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          
          this.totalLeads = response.data.filter(lead => {
            const leadDate = new Date(lead.createdAt);
            leadDate.setHours(0, 0, 0, 0);
            return leadDate.getTime() === today.getTime();
          }).length;
          
          this.cdr.detectChanges();
        }
      },
      error: (error) => {
        console.error('Error loading leads:', error);
      }
    });
  }

  loadUrgentMilestoneTasks(): void {
    // סנן רק פרויקטים פתוחים (isFinal === false)
    const openProjects = this.activeProjects.filter(project => {
      const status = this.projectStatuses.find(s => s.statusNumber === project.statusNumber);
      return status && status.isFinal === false;
    });
    const milestoneTasks: UrgentMilestoneTask[] = openProjects.flatMap(project =>
      project.stages
        .filter(stage => stage.milestones && stage.milestones.length > 0)
        .flatMap(stage =>
          stage.milestones
            .filter(milestone => milestone.isUrgent)
            .map(milestone => {
              const date = milestone.date ? new Date(milestone.date) : null;
              const timeLabel = date 
                ? `${date.toLocaleDateString('he-IL')}`
                : '';
              const stageLabel = stage.stageName || `שלב ${stage.stageNumber}`;
              
              return {
                title: `${project.projectName} • ${stageLabel} • ${milestone.name}`,
                time: timeLabel
              };
            })
        )
    );
    
    this.urgentMilestoneTasks = milestoneTasks;
  }

  loadProjectStatuses(): void {
    this.projectStatusService.getAll().subscribe({
      next: (response) => {
        if (response.isSuccess && response.data) {
          this.projectStatuses = response.data;
          this.cdr.detectChanges();
        }
      },
      error: (error) => {
        console.error('Error loading project statuses:', error);
      }
    });
  }

  loadTaskStatuses(): void {
    this.generalTaskStatusService.getAll().subscribe({
      next: (response) => {
        if (response.isSuccess && response.data) {
          this.taskStatuses = response.data;
          this.cdr.detectChanges();
        }
      },
      error: (error) => {
        console.error('Error loading task statuses:', error);
      }
    });
  }

  loadUpcomingTasks(): void {
    this.generalTaskService.getAll().subscribe({
      next: (response) => {
        if (response.isSuccess && response.data) {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          
          const nextWeek = new Date(today);
          nextWeek.setDate(today.getDate() + 7);
          
          // סנן משימות לשבוע הקרוב ורק פתוחות (לא בסטטוס סופי)
          this.upcomingTasks = response.data
            .filter(task => {
              if (!task.date) return false;
              const taskDate = new Date(task.date);
              taskDate.setHours(0, 0, 0, 0);
              
              // בדוק שהתאריך בטווח
              if (taskDate < today || taskDate > nextWeek) return false;
              
              // בדוק שהסטטוס לא סופי
              const status = this.taskStatuses.find(s => s.statusNumber === task.statusNumber);
              return status && !status.isFinal;
            })
            .sort((a, b) => {
              const dateA = new Date(a.date!).getTime();
              const dateB = new Date(b.date!).getTime();
              return dateA - dateB;
            });
          
          this.cdr.detectChanges();
        }
      },
      error: (error) => {
        console.error('Error loading upcoming tasks:', error);
      }
    });
  }

  getTaskStatusName(statusNumber: number): string {
    const status = this.taskStatuses.find(s => s.statusNumber === statusNumber);
    return status ? status.name : '';
  }

  calculatePendingMilestoneTasks(): void {
    this.pendingMilestoneTasks = 0;
    this.activeProjects.forEach(project => {
      project.stages.forEach(stage => {
        if (stage.milestones) {
          stage.milestones.forEach(milestone => {
            // Count milestones that are not completed (status < 4)
            if (milestone.statusNumber && milestone.statusNumber < 4) {
              this.pendingMilestoneTasks++;
            }
          });
        }
      });
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

  getProjectProgress(project: Project): number {
    if (!project.stages || project.stages.length === 0) return 0;
    
    let totalMilestones = 0;
    let completedMilestones = 0;
    
    project.stages.forEach(stage => {
      if (stage.milestones) {
        totalMilestones += stage.milestones.length;
        completedMilestones += stage.milestones.filter(m => m.statusNumber === 4).length;
      }
    });
    
    return totalMilestones > 0 ? Math.round((completedMilestones / totalMilestones) * 100) : 0;
  }

  getStatDifference(current: number, previous: number, inverse: boolean = false): string {
    const diff = current - previous;
    if (diff === 0) return '0';
    
    const sign = inverse ? (diff > 0 ? '-' : '+') : (diff > 0 ? '+' : '');
    return `${sign}${Math.abs(diff)}`;
  }

  getStatBadgeClass(current: number, previous: number, inverse: boolean = false): string {
    const diff = current - previous;
    if (diff === 0) return '';
    
    if (inverse) {
      return diff > 0 ? 'negative' : 'positive';
    } else {
      return diff > 0 ? 'positive' : 'negative';
    }
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
