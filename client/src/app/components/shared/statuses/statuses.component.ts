import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MilestoneStatusService } from '../../../services/milestone-status.service';
import { ProjectStatusService } from '../../../services/project-status.service';
import { LeadStatusService } from '../../../services/lead-status.service';
import { MessageDialogService } from '../../../services/message-dialog.service';
import { MilestoneStatus } from '../../../models/milestone-status.model';
import { ProjectStatus } from '../../../models/project-status.model';
import { LeadStatus } from '../../../models/lead.model';
import { ProjectStatusFormComponent } from '../project-status-form/project-status-form.component';
import { MilestoneStatusFormComponent } from '../milestone-status-form/milestone-status-form.component';
import { LeadStatusFormComponent } from '../lead-status-form/lead-status-form.component';

@Component({
  selector: 'app-statuses',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatTabsModule,
    MatCheckboxModule,
    MatTooltipModule
  ],
  templateUrl: './statuses.component.html',
  styleUrl: './statuses.component.scss'
})
export class StatusesComponent implements OnInit {
  milestoneStatuses: MilestoneStatus[] = [];
  projectStatuses: ProjectStatus[] = [];
  leadStatuses: LeadStatus[] = [];
  isLoading = false;
  
  milestoneColumns: string[] = ['milestoneStatusNumber', 'name', 'isFinal', 'milestoneCount', 'actions'];
  projectColumns: string[] = ['statusNumber', 'name', 'isFinal', 'isPause', 'projectCount', 'actions'];
  leadColumns: string[] = ['statusNumber', 'name', 'isFinal', 'leadCount', 'actions'];

  constructor(
    private milestoneStatusService: MilestoneStatusService,
    private projectStatusService: ProjectStatusService,
    private leadStatusService: LeadStatusService,
    private messageDialogService: MessageDialogService,
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loadMilestoneStatuses();
    this.loadProjectStatuses();
    this.loadLeadStatuses();
  }

  loadMilestoneStatuses(): void {
    this.isLoading = true;
    
    this.milestoneStatusService.getAllWithCounts().subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.isSuccess && response.data) {
          this.milestoneStatuses = response.data;
          this.cdr.detectChanges();
        } else {
          this.messageDialogService.showError('שגיאה בטעינת סטטוסי אבני דרך');
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.messageDialogService.showError('שגיאה בטעינת סטטוסי אבני דרך');
      }
    });
  }

  loadProjectStatuses(): void {
        this.isLoading = true;

    
    this.projectStatusService.getAllWithCounts().subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.isSuccess && response.data) {
          this.projectStatuses = response.data;
          this.cdr.detectChanges();
        } else {
          this.messageDialogService.showError('שגיאה בטעינת סטטוסי פרויקטים');
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.messageDialogService.showError('שגיאה בטעינת סטטוסי פרויקטים');
      }
    });
  }

  openProjectStatusForm(status?: ProjectStatus): void {
    const dialogRef = this.dialog.open(ProjectStatusFormComponent, {
      width: '600px',
      disableClose: true,
      data: status || null
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.saveProjectStatus(result, status?.id);
      }
    });
  }

  saveProjectStatus(statusData: Partial<ProjectStatus>, id?: string): void {
    const confirmMessage = id ? 'האם אתה בטוח שברצונך לעדכן את הסטטוס?' : null;
    
    const performSave = () => {
      this.isLoading = true;
      
      const operation = id 
        ? this.projectStatusService.update(id, statusData)
        : this.projectStatusService.create(statusData);

      operation.subscribe({
        next: (response) => {
          this.isLoading = false;
          if (response.isSuccess) {
            this.messageDialogService.showSuccess(
              id ? 'סטטוס עודכן בהצלחה' : 'סטטוס נוסף בהצלחה'
            );
            this.loadProjectStatuses();
          } else {
            this.messageDialogService.showError('שגיאה בשמירת הסטטוס: ' + (response.errorText || 'Unknown error'));
          }
        },
        error: (err) => {
          this.isLoading = false;
          this.messageDialogService.showError('שגיאה בשמירת הסטטוס');
        }
      });
    };

    if (confirmMessage) {
      this.messageDialogService.confirm(confirmMessage).subscribe(result => {
        if (result === 'yes') {
          performSave();
        }
      });
    } else {
      performSave();
    }
  }

  editProjectStatus(status: ProjectStatus): void {
    this.openProjectStatusForm(status);
  }

  deleteProjectStatus(status: ProjectStatus): void {
    this.messageDialogService.confirm('האם אתה בטוח שברצונך למחוק את הסטטוס?').subscribe(result => {
      if (result === 'yes') {
        this.isLoading = true;
        this.projectStatusService.delete(status.id).subscribe({
          next: (response) => {
            this.isLoading = false;
            if (response.isSuccess) {
              this.messageDialogService.showSuccess('סטטוס נמחק בהצלחה');
              this.loadProjectStatuses();
            } else {
              this.messageDialogService.showError('שגיאה במחיקת הסטטוס: ' + (response.errorText || 'Unknown error'));
            }
          },
          error: (err) => {
            this.isLoading = false;
            this.messageDialogService.showError('שגיאה במחיקת הסטטוס');
          }
        });
      }
    });
  }

  openMilestoneStatusForm(status?: MilestoneStatus): void {
    const dialogRef = this.dialog.open(MilestoneStatusFormComponent, {
      width: '600px',
      disableClose: true,
      data: status || null
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.saveMilestoneStatus(result, status?.id);
      }
    });
  }

  saveMilestoneStatus(statusData: Partial<MilestoneStatus>, id?: number): void {
    const confirmMessage = id ? 'האם אתה בטוח שברצונך לעדכן את הסטטוס?' : null;
    
    const performSave = () => {
      this.isLoading = true;
      
      const operation = id 
        ? this.milestoneStatusService.updateMilestoneStatus(id, statusData)
        : this.milestoneStatusService.createMilestoneStatus(statusData);

      operation.subscribe({
        next: (response) => {
          this.isLoading = false;
          if (response.isSuccess) {
            this.messageDialogService.showSuccess(
              id ? 'סטטוס עודכן בהצלחה' : 'סטטוס נוסף בהצלחה'
            );
            this.loadMilestoneStatuses();
          } else {
            this.messageDialogService.showError('שגיאה בשמירת הסטטוס: ' + (response.errorText || 'Unknown error'));
          }
        },
        error: (err) => {
          this.isLoading = false;
          this.messageDialogService.showError('שגיאה בשמירת הסטטוס');
        }
      });
    };

    if (confirmMessage) {
      this.messageDialogService.confirm(confirmMessage).subscribe(result => {
        if (result === 'yes') {
          performSave();
        }
      });
    } else {
      performSave();
    }
  }

  editMilestoneStatus(status: MilestoneStatus): void {
    this.openMilestoneStatusForm(status);
  }

  deleteMilestoneStatus(status: MilestoneStatus): void {
    this.messageDialogService.confirm('האם אתה בטוח שברצונך למחוק את הסטטוס?').subscribe(result => {
      if (result === 'yes') {
        this.isLoading = true;
        this.milestoneStatusService.deleteMilestoneStatus(status.id).subscribe({
          next: (response) => {
            this.isLoading = false;
            if (response.isSuccess) {
              this.messageDialogService.showSuccess('סטטוס נמחק בהצלחה');
              this.loadMilestoneStatuses();
            } else {
              this.messageDialogService.showError('שגיאה במחיקת הסטטוס: ' + (response.errorText || 'Unknown error'));
            }
          },
          error: (err) => {
            this.isLoading = false;
            this.messageDialogService.showError('שגיאה במחיקת הסטטוס');
          }
        });
      }
    });
  }

  loadLeadStatuses(): void {
    this.isLoading = true;
    
    this.leadStatusService.getAllWithCounts().subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.isSuccess && response.data) {
          this.leadStatuses = response.data;
          this.cdr.detectChanges();
        } else {
          this.messageDialogService.showError('שגיאה בטעינת סטטוסי לידים');
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.messageDialogService.showError('שגיאה בטעינת סטטוסי לידים');
      }
    });
  }

  openLeadStatusForm(status?: LeadStatus): void {
    const dialogRef = this.dialog.open(LeadStatusFormComponent, {
      width: '600px',
      disableClose: true,
      data: status || null
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.saveLeadStatus(result, status?.id);
      }
    });
  }

  saveLeadStatus(statusData: Partial<LeadStatus>, id?: string): void {
    const confirmMessage = id ? 'האם אתה בטוח שברצונך לעדכן את הסטטוס?' : null;
    
    const performSave = () => {
      this.isLoading = true;
      
      const operation = id 
        ? this.leadStatusService.update(id, statusData)
        : this.leadStatusService.create(statusData);

      operation.subscribe({
        next: (response) => {
          this.isLoading = false;
          if (response.isSuccess) {
            this.messageDialogService.showSuccess(
              id ? 'סטטוס עודכן בהצלחה' : 'סטטוס נוסף בהצלחה'
            );
            this.loadLeadStatuses();
          } else {
            this.messageDialogService.showError('שגיאה בשמירת הסטטוס: ' + (response.errorText || 'Unknown error'));
          }
        },
        error: (err) => {
          this.isLoading = false;
          this.messageDialogService.showError('שגיאה בשמירת הסטטוס');
        }
      });
    };

    if (confirmMessage) {
      this.messageDialogService.confirm(confirmMessage).subscribe(result => {
        if (result === 'yes') {
          performSave();
        }
      });
    } else {
      performSave();
    }
  }

  editLeadStatus(status: LeadStatus): void {
    this.openLeadStatusForm(status);
  }

  deleteLeadStatus(status: LeadStatus): void {
    this.messageDialogService.confirm('האם אתה בטוח שברצונך למחוק את הסטטוס?').subscribe(result => {
      if (result === 'yes') {
        this.isLoading = true;
        this.leadStatusService.delete(status.id).subscribe({
          next: (response) => {
            this.isLoading = false;
            if (response.isSuccess) {
              this.messageDialogService.showSuccess('סטטוס נמחק בהצלחה');
              this.loadLeadStatuses();
            } else {
              this.messageDialogService.showError('שגיאה במחיקת הסטטוס: ' + (response.errorText || 'Unknown error'));
            }
          },
          error: (err) => {
            this.isLoading = false;
            this.messageDialogService.showError('שגיאה במחיקת הסטטוס');
          }
        });
      }
    });
  }
}
