import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ProjectService } from '../../../services/project.service';
import { Project } from '../../../models/project.model';
import { finalize } from 'rxjs';

interface StageCount {
  stageName: string;
  projectCount: number;
}

@Component({
  selector: 'app-dashboard-charts',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './dashboard-charts.component.html',
  styleUrl: './dashboard-charts.component.scss'
})
export class DashboardChartsComponent implements OnInit {
  loading = false;
  stageData: StageCount[] = [];
  maxCount = 0;
  totalProjects = 0;
  
  private colors = [
    '#A8E6CF',
    '#FFD3B6',
    '#FFAAA5',
    '#FF8B94',
    '#B4A7D6',
    '#A3D9FF',
    '#FFE66D',
    '#C7CEEA'
  ];

  constructor(
    private projectService: ProjectService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadChartData();
  }

  loadChartData(): void {
    this.loading = true;
    this.projectService.getAll()
      .pipe(finalize(() => {
        this.loading = false;
        this.cdr.detectChanges();
      }))
      .subscribe({
        next: (response: any) => {
          if ((response.success || response.isSuccess) && response.data) {
            this.processProjectData(response.data);
            this.cdr.detectChanges();
          }
        },
        error: (error: any) => {
          console.error('Error loading projects:', error);
        }
      });
  }

  processProjectData(projects: Project[]): void {
    // מיפוי שלבים נוכחיים לפרויקטים
    const stageMap = new Map<string, number>();

    projects.forEach(project => {
      // ספירה לפי השלב הנוכחי של הפרויקט בלבד
      if (project.currentStage) {
        const count = stageMap.get(project.currentStage) || 0;
        stageMap.set(project.currentStage, count + 1);
      }
    });

    // המרה למערך וחישוב מקסימום
    this.stageData = Array.from(stageMap.entries())
      .map(([stageName, projectCount]) => ({
        stageName,
        projectCount
      }))
      .sort((a, b) => b.projectCount - a.projectCount);

    this.maxCount = this.stageData.length > 0 
      ? Math.max(...this.stageData.map(d => d.projectCount))
      : 0;
    
    this.totalProjects = this.stageData.reduce((sum, item) => sum + item.projectCount, 0);
  }

  getColor(index: number): string {
    return this.colors[index % this.colors.length];
  }

  getTotalProjects(): number {
    return this.totalProjects;
  }

  getStrokeDasharray(count: number): string {
    const percentage = this.totalProjects > 0 ? (count / this.totalProjects) * 100 : 0;
    return `${percentage} ${100 - percentage}`;
  }

  getStrokeDashoffset(index: number): number {
    let offset = 0;
    for (let i = 0; i < index; i++) {
      const percentage = this.totalProjects > 0 ? (this.stageData[i].projectCount / this.totalProjects) * 100 : 0;
      offset -= percentage;
    }
    return offset;
  }

  getBarWidth(count: number): string {
    if (this.maxCount === 0) return '0%';
    return `${(count / this.maxCount) * 100}%`;
  }
}
