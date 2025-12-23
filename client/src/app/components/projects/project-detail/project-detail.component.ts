    // ...existing code...
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ProjectService } from '../../../services/project.service';
import { MilestoneStatusService } from '../../../services/milestone-status.service';
import { Project, Stage, Milestone } from '../../../models/project.model';
import { MilestoneStatus } from '../../../models/milestone-status.model';
import { MilestoneFormComponent } from '../milestone-form/milestone-form.component';
import { MessageDialogService } from '../../../services/message-dialog.service';

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
    MatExpansionModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './project-detail.component.html',
  styleUrl: './project-detail.component.scss'
})
export class ProjectDetailComponent implements OnInit {
  project: Project | undefined;
  selectedTabIndex = 0;
  milestoneStatuses: MilestoneStatus[] = [];
  isLoading: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private projectService: ProjectService,
    private milestoneStatusService: MilestoneStatusService,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef,
    private messageDialogService: MessageDialogService
  ) {}

  setCurrentMilestone(milestone: Milestone, stage: Stage): void {
    
    if (!this.project) return;
    this.isLoading = true;
    this.projectService.update(this.project.id, { 
      currentStageNumber: stage.stageNumber,
      currentStage: stage.name,
      currentMilestoneId: milestone.milestoneId
    }).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.isSuccess) {
          this.messageDialogService.showSuccess('אבן דרך נבחרה בהצלחה');
          this.reloadProject();
        } else {
          this.messageDialogService.showError('שגיאה בעדכון milestone: ' + (response.errorText || 'Unknown error'));
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.messageDialogService.showError('שגיאה בעדכון milestone');
      }
    });
  }

  ngOnInit(): void {
    // Load milestone statuses first
    this.milestoneStatusService.getAllMilestoneStatuses().subscribe({
      next: (response) => {
        if (response.isSuccess && response.data) {
          this.milestoneStatuses = response.data;
        }
      },
      error: (err) => {
        this.messageDialogService.showError('שגיאה בטעינת סטטוסי milestone');
      }
    });

    const projectId = this.route.snapshot.paramMap.get('id');
    if (projectId) {
      this.isLoading = true;
      this.projectService.getById(projectId).subscribe({
        next: (response) => {
          this.isLoading = false;
          console.log('Project response:', response);
          if (!response.isSuccess || !response.data) {
            this.messageDialogService.showError('שגיאה בטעינת פרויקט: ' + (response.errorText || 'Unknown error'));
            this.router.navigate(['/projects']);
          } else {
            this.project = response.data;
            
            console.log('Project loaded:', this.project);
            // Set tab index based on current stage number
            if (this.project.currentStageNumber && this.project.stages) {
              let stageIndex = this.project.stages.findIndex(s => s.stageNumber === this.project!.currentStageNumber);
              if (stageIndex !== -1) {
                this.selectedTabIndex = stageIndex;
              }
            }
            this.cdr.detectChanges();
          }
        },
        error: (err) => {
          this.isLoading = false;
          this.messageDialogService.showError('שגיאה בטעינת פרויקט');
          this.router.navigate(['/projects']);
        }
      });
    }
  }

  getTabIndex(stage: string): number {
    switch (stage) {
      case 'פרה': return 0;
      case 'פרודקשן': return 1;
      case 'פוסט': return 2;
      default: return 0;
    }
  }

  openMilestoneForm(stage: Stage, milestone: Milestone): void {
    if (!this.project) return;

    // הוספת stageNumber ל-milestone
    const milestoneWithStageNumber = {
      ...milestone,
      stageNumber: stage.stageNumber
    };

    const dialogRef = this.dialog.open(MilestoneFormComponent, {
      width: '700px',
      data: { 
        projectId: this.project.id, 
        stageName: stage.name, 
        milestone: milestoneWithStageNumber
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
      this.isLoading = true;
      this.projectService.getById(this.project.id).subscribe({
        next: (response) => {
          this.isLoading = false;
          if (response.isSuccess && response.data) {
            this.project = response.data;
            this.cdr.detectChanges();
          }
        },
        error: (err) => {
          this.isLoading = false;
          this.messageDialogService.showError('שגיאה בטעינת פרויקט');
        }
      });
    }
  }

  getStatusByNumber(statusNumber: number): string {
    const status = this.milestoneStatuses.find(s => s.milestoneStatusNumber === statusNumber);
    return status ? status.hebName : '';
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

  changeStage(stage: string): void {
    if (!this.project) return;
    const projectId = this.project.id;
    this.messageDialogService.confirm(`האם לעבור לשלב ${stage}?`).subscribe((result: 'yes' | 'no') => {
      if (result === 'yes') {
        this.isLoading = true;
        this.projectService.update(projectId, { currentStage: stage }).subscribe({
          next: (response) => {
            this.isLoading = false;
            if (response.isSuccess) {
              this.messageDialogService.showSuccess('השלב עודכן בהצלחה');
              this.reloadProject();
            } else {
              this.messageDialogService.showError('שגיאה בשינוי שלב: ' + (response.errorText || 'Unknown error'));
            }
          },
          error: (err) => {
            this.isLoading = false;
            this.messageDialogService.showError('שגיאה בשינוי שלב');
          }
        });
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/projects']);
  }
}
