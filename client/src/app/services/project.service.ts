import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Project, ProjectStage, Stage, PRE_MILESTONES, PRODUCTION_MILESTONES, POST_MILESTONES, MilestoneStatus } from '../models/project.model';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private storageKey = 'projects';

  getAll(): Observable<Project[]> {
    const data = localStorage.getItem(this.storageKey);
    const projects = data ? JSON.parse(data) : [];
    return of(projects);
  }

  getById(id: string): Observable<Project | undefined> {
    const data = localStorage.getItem(this.storageKey);
    const projects: Project[] = data ? JSON.parse(data) : [];
    return of(projects.find(project => project.id === id));
  }

  getActiveProjects(): Observable<Project[]> {
    return this.getAll();
  }

  create(project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Observable<Project> {
    const newProject: Project = {
      ...project,
      id: this.generateId(),
      stages: project.stages && project.stages.length > 0 ? project.stages : this.initializeStages(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const data = localStorage.getItem(this.storageKey);
    const projects: Project[] = data ? JSON.parse(data) : [];
    projects.push(newProject);
    localStorage.setItem(this.storageKey, JSON.stringify(projects));
    return of(newProject);
  }

  update(id: string, updates: Partial<Project>): Observable<Project> {
    const data = localStorage.getItem(this.storageKey);
    const projects: Project[] = data ? JSON.parse(data) : [];
    const index = projects.findIndex(project => project.id === id);
    
    if (index !== -1) {
      projects[index] = {
        ...projects[index],
        ...updates,
        updatedAt: new Date()
      };
      localStorage.setItem(this.storageKey, JSON.stringify(projects));
      return of(projects[index]);
    }
    
    return of(updates as Project);
  }

  delete(id: string): Observable<void> {
    const data = localStorage.getItem(this.storageKey);
    const projects: Project[] = data ? JSON.parse(data) : [];
    const filtered = projects.filter(project => project.id !== id);
    localStorage.setItem(this.storageKey, JSON.stringify(filtered));
    return of(undefined);
  }

  private initializeStages(): Stage[] {
    return [
      {
        name: ProjectStage.PRE,
        milestones: PRE_MILESTONES.map(name => ({
          id: this.generateId(),
          name,
          documentReference: '',
          status: MilestoneStatus.BEFORE_START,
          suppliers: []
        }))
      },
      {
        name: ProjectStage.PRODUCTION,
        milestones: PRODUCTION_MILESTONES.map(name => ({
          id: this.generateId(),
          name,
          documentReference: '',
          status: MilestoneStatus.BEFORE_START,
          suppliers: []
        }))
      },
      {
        name: ProjectStage.POST,
        milestones: POST_MILESTONES.map(name => ({
          id: this.generateId(),
          name,
          documentReference: '',
          status: MilestoneStatus.BEFORE_START,
          suppliers: []
        }))
      }
    ];
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}
