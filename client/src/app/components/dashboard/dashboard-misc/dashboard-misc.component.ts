import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ProjectService } from '../../../services/project.service';
import { ProjectStatusService } from '../../../services/project-status.service';
import { Project } from '../../../models/project.model';
import { ProjectStatus } from '../../../models/project-status.model';

@Component({
  selector: 'app-dashboard-misc',
  standalone: true,
  imports: [
    CommonModule, 
    MatCardModule, 
    MatIconModule,
    MatTooltipModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './dashboard-misc.component.html',
  styleUrl: './dashboard-misc.component.scss'
})
export class DashboardMiscComponent implements OnInit {
  activeProjects: Project[] = [];
  projectStatuses: ProjectStatus[] = [];
  financialChartData: { projectName: string, paidAmount: number, profit: number, suppliersCost: number }[] = [];
  isLoading = false;

  constructor(
    private projectService: ProjectService,
    private projectStatusService: ProjectStatusService,
    private cdr: ChangeDetectorRef
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
          this.updateFinancialChartData();
          this.cdr.detectChanges();
        }
      },
      error: (error) => {
        console.error('Error loading project statuses:', error);
      }
    });
  }

  loadProjects(): void {
    this.isLoading = true;
    this.projectService.getActiveProjects().subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.isSuccess && response.data) {
          this.activeProjects = response.data;
          this.updateFinancialChartData();
          this.cdr.detectChanges();
        }
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error loading projects:', error);
      }
    });
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

  getProjectProfit(project: Project): number {
    const totalPaid = project.paidAmount || 0;
    const totalSuppliers = this.getTotalSuppliersAmount(project);
    return totalPaid - totalSuppliers;
  }

  updateFinancialChartData(): void {
    const openProjects = this.activeProjects.filter(project => {
      const status = this.projectStatuses.find(s => s.statusNumber === project.statusNumber);
      return status && status.isFinal === false;
    });

    this.financialChartData = openProjects.map(project => ({
      projectName: project.projectName,
      paidAmount: project.paidAmount || 0,
      profit: this.getProjectProfit(project),
      suppliersCost: this.getTotalSuppliersAmount(project)
    }));
    
    console.log('Financial chart data updated:', this.financialChartData);
  }

  getBarHeight(value: number): number {
    if (this.financialChartData.length === 0) return 0;
    
    const allValues = this.financialChartData.flatMap(d => [d.profit, d.suppliersCost]);
    const maxValue = Math.max(...allValues, 1);
    
    // גובה מקסימלי של 200px
    const maxHeight = 200;
    return Math.max((value / maxValue) * maxHeight, 20); // מינימום 20px כדי שיהיה נראה
  }

  getBarWidth(value: number): number {
    if (this.financialChartData.length === 0) return 0;
    
    const allValues = this.financialChartData.flatMap(d => [d.paidAmount, d.profit, d.suppliersCost]);
    const maxValue = Math.max(...allValues, 1);
    
    // רוחב מקסימלי של 100%
    return Math.max((value / maxValue) * 100, 2); // מינימום 2% כדי שיהיה נראה
  }
}
