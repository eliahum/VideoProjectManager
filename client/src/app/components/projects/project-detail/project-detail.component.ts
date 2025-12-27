import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MAT_DATE_FORMATS, MAT_DATE_LOCALE, NativeDateAdapter, DateAdapter } from '@angular/material/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DragDropModule, CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { ProjectService } from '../../../services/project.service';
import { MilestoneStatusService } from '../../../services/milestone-status.service';
import { ProjectStatusService } from '../../../services/project-status.service';
import { Project, Stage, Milestone } from '../../../models/project.model';
import { MilestoneStatus } from '../../../models/milestone-status.model';
import { ProjectStatus } from '../../../models/project-status.model';
import { MilestoneFormComponent } from '../milestone-form/milestone-form.component';
import { MessageDialogService } from '../../../services/message-dialog.service';

export class CustomDateAdapter extends NativeDateAdapter {
  override parse(value: any): Date | null {
    if (typeof value === 'string') {
      const parts = value.split('/');
      if (parts.length === 3) {
        const day = Number(parts[0]);
        const month = Number(parts[1]) - 1;
        const year = Number(parts[2]);
        return new Date(year, month, day);
      }
    }
    return super.parse(value);
  }

  override format(date: Date, displayFormat: Object): string {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${this.pad(day)}/${this.pad(month)}/${year}`;
  }

  private pad(n: number): string {
    return n < 10 ? '0' + n : '' + n;
  }
}

const MY_DATE_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'DD/MM/YYYY',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-project-detail',
  standalone: true,
  providers: [
    { provide: DateAdapter, useClass: CustomDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
    { provide: MAT_DATE_LOCALE, useValue: 'he-IL' }
  ],
  imports: [
    CommonModule,
    FormsModule,
    MatTabsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTooltipModule,
    MatDialogModule,
    MatExpansionModule,
    MatProgressSpinnerModule,
    DragDropModule
  ],
  templateUrl: './project-detail.component.html',
  styleUrl: './project-detail.component.scss'
})
export class ProjectDetailComponent implements OnInit {
  project: Project | undefined;
  selectedTabIndex = 0;
  milestoneStatuses: MilestoneStatus[] = [];
  projectStatuses: ProjectStatus[] = [];
  isLoading: boolean = false;
  isEditingPayment: boolean = false;
  paymentData = {
    paidAmount: 0,
    paymentDate: null as Date | null,
    paymentNote: ''
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private projectService: ProjectService,
    private milestoneStatusService: MilestoneStatusService,
    private projectStatusService: ProjectStatusService,
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

    // Load project statuses
    this.projectStatusService.getAll().subscribe({
      next: (response) => {
        if (response.isSuccess && response.data) {
          this.projectStatuses = response.data;
        }
      },
      error: (err) => {
        this.messageDialogService.showError('שגיאה בטעינת סטטוסי פרויקט');
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
            this.initializePaymentData();
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
      width: '740px',
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
            this.initializePaymentData();
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

  initializePaymentData(): void {
    if (this.project) {
      this.paymentData = {
        paidAmount: this.project.paidAmount || 0,
        paymentDate: this.project.paymentDate ? new Date(this.project.paymentDate) : null,
        paymentNote: this.project.paymentNote || ''
      };
    }
  }

  editPaymentInfo(): void {
    this.isEditingPayment = true;
  }

  savePaymentInfo(): void {
    if (!this.project) return;

    // Fix timezone issue - set time to noon UTC to avoid date shifting
    let paymentDate: Date | undefined = undefined;
    if (this.paymentData.paymentDate) {
      const localDate = new Date(this.paymentData.paymentDate);
      paymentDate = new Date(Date.UTC(
        localDate.getFullYear(),
        localDate.getMonth(),
        localDate.getDate(),
        12, 0, 0, 0
      ));
    }

    this.isLoading = true;
    this.projectService.update(this.project.id, {
      paidAmount: this.paymentData.paidAmount,
      paymentDate: paymentDate,
      paymentNote: this.paymentData.paymentNote
    }).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.isSuccess) {
          this.isEditingPayment = false;
          this.messageDialogService.showSuccess('פרטי תשלום עודכנו בהצלחה');
          this.reloadProject();
        } else {
          this.messageDialogService.showError('שגיאה בעדכון פרטי תשלום: ' + (response.errorText || 'Unknown error'));
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.messageDialogService.showError('שגיאה בעדכון פרטי תשלום');
      }
    });
  }

  cancelPaymentEdit(): void {
    this.isEditingPayment = false;
    this.initializePaymentData();
  }

  goBack(): void {
    this.router.navigate(['/projects']);
  }

  updateProjectStatus(statusNumber: number): void {
    if (!this.project) return;
    this.isLoading = true;
    this.projectService.update(this.project.id, { statusNumber }).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.isSuccess) {
          this.messageDialogService.showSuccess('סטטוס הפרויקט עודכן בהצלחה');
          this.reloadProject();
        } else {
          this.messageDialogService.showError('שגיאה בעדכון סטטוס: ' + (response.errorText || 'Unknown error'));
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.messageDialogService.showError('שגיאה בעדכון סטטוס');
      }
    });
  }

  updateMilestoneStatus(statusNumber: number, stage: Stage, milestone: Milestone): void {
    if (!this.project) return;
    
    this.projectService.updateMilestone(
      this.project.id,
      stage.stageNumber,
      milestone.milestoneId,
      { statusNumber }
    ).subscribe({
      next: (response) => {
        if (response.isSuccess) {
          this.messageDialogService.showSuccess('סטטוס אבן הדרך עודכן בהצלחה');
          this.reloadProject();
        } else {
          this.messageDialogService.showError('שגיאה בעדכון סטטוס: ' + (response.errorText || 'Unknown error'));
        }
      },
      error: (err) => {
        this.messageDialogService.showError('שגיאה בעדכון סטטוס');
      }
    });
  }

  deleteMilestone(event: Event, stage: Stage, milestone: Milestone): void {
    event.stopPropagation();
    if (!this.project) return;

    this.messageDialogService.confirm(`האם למחוק את אבן הדרך "${milestone.name}"?`).subscribe((result: 'yes' | 'no') => {
      if (result === 'yes' && this.project) {
        this.isLoading = true;
        this.projectService.deleteMilestone(
          this.project.id,
          stage.stageNumber,
          milestone.milestoneId
        ).subscribe({
          next: (response) => {
            this.isLoading = false;
            if (response.isSuccess) {
              this.messageDialogService.showSuccess('אבן דרך נמחקה בהצלחה');
              this.reloadProject();
            } else {
              this.messageDialogService.showError('שגיאה במחיקת אבן דרך: ' + (response.errorText || 'Unknown error'));
            }
          },
          error: (err) => {
            this.isLoading = false;
            this.messageDialogService.showError('שגיאה במחיקת אבן דרך');
          }
        });
      }
    });
  }

  addNewMilestone(stage: Stage): void {
    if (!this.project) return;

    // פותח את הטופס ללא milestone קיים (מצב יצירה)
    const dialogRef = this.dialog.open(MilestoneFormComponent, {
      width: '740px',
      data: { 
        projectId: this.project.id, 
        stageName: stage.name,
        stageNumber: stage.stageNumber,
        milestone: null // null מסמן שזו יצירה חדשה
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.reloadProject();
      }
    });
  }

  addNewMilestoneToCurrentStage(): void {
    if (!this.project || !this.project.stages) return;
    
    // מוצא את השלב הנוכחי לפי ה-tab שנבחר
    const currentStage = this.project.stages[this.selectedTabIndex];
    if (currentStage) {
      this.addNewMilestone(currentStage);
    }
  }

  onMilestoneDrop(event: CdkDragDrop<Milestone[]>, stage: Stage): void {
    if (!this.project) return;

    const projectId = this.project.id;
    const milestones = stage.milestones;
    
    // Get the two milestones being swapped
    const fromMilestone = milestones[event.previousIndex];
    const toMilestone = milestones[event.currentIndex];
    // Swap their sort values
    const tempSort = fromMilestone.sort;
    fromMilestone.sort = toMilestone.sort;
    toMilestone.sort = tempSort;
    
    // Move item in array for UI update
    moveItemInArray(milestones, event.previousIndex, event.currentIndex);

    // Update both milestones on the server
    this.projectService.updateMilestone(
      projectId,
      stage.stageNumber,
      fromMilestone.milestoneId,
      { sort: fromMilestone.sort }
    ).subscribe({
      next: (response) => {
        if (!response.isSuccess) {
          console.error('Failed to update first milestone sort:', response.errorText);
          this.messageDialogService.showError('שגיאה בעדכון סדר אבני דרך');
        } else {
          // Only update second milestone after first succeeds
    
          this.projectService.updateMilestone(
            projectId,
            stage.stageNumber,
            toMilestone.milestoneId,
            { sort: toMilestone.sort }
          ).subscribe({
            next: (response2) => {
              if (!response2.isSuccess) {
                console.error('Failed to update second milestone sort:', response2.errorText);
                this.messageDialogService.showError('שגיאה בעדכון סדר אבני דרך');
              } else {
                // Reload project data after successful update
                this.reloadProject();
              }
            },
            error: (err) => {
              console.error('Error updating second milestone sort:', err);
              this.messageDialogService.showError('שגיאה בעדכון סדר אבני דרך');
              this.cdr.detectChanges();
            }
          });
        }
      },
      error: (err) => {
        console.error('Error updating first milestone sort:', err);
        this.messageDialogService.showError('שגיאה בעדכון סדר אבני דרך');
        this.cdr.detectChanges();
      }
    });
  }
}
