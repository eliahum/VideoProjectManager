import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Project, ProjectResponse, ProjectListResponse } from '../models/project.model';
import { API_BASE_URL } from '../../environments/api.config';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private apiUrl = `${API_BASE_URL}/api/projects`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<ProjectListResponse> {
    return this.http.get<ProjectListResponse>(this.apiUrl);
  }

  getById(id: string): Observable<ProjectResponse> {
    return this.http.get<ProjectResponse>(`${this.apiUrl}/${id}`);
  }

  getActiveProjects(): Observable<ProjectListResponse> {
    return this.getAll();
  }

  create(project: Partial<Project>): Observable<ProjectResponse> {
    return this.http.post<ProjectResponse>(this.apiUrl, project);
  }

  update(id: string, updates: Partial<Project>): Observable<ProjectResponse> {
    return this.http.put<ProjectResponse>(`${this.apiUrl}/${id}`, updates);
  }

  delete(id: string): Observable<ProjectResponse> {
    return this.http.delete<ProjectResponse>(`${this.apiUrl}/${id}`);
  }
}
