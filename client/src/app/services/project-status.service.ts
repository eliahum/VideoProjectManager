import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProjectStatus, ProjectStatusResponse, ProjectStatusListResponse } from '../models/project-status.model';
import { API_BASE_URL } from '../../environments/api.config';

@Injectable({
  providedIn: 'root'
})
export class ProjectStatusService {
  private apiUrl = `${API_BASE_URL}/api/project-statuses`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<ProjectStatusListResponse> {
    return this.http.get<ProjectStatusListResponse>(this.apiUrl);
  }

  getById(id: string): Observable<ProjectStatusResponse> {
    return this.http.get<ProjectStatusResponse>(`${this.apiUrl}/${id}`);
  }

  create(status: Partial<ProjectStatus>): Observable<ProjectStatusResponse> {
    return this.http.post<ProjectStatusResponse>(this.apiUrl, status);
  }

  update(id: string, updates: Partial<ProjectStatus>): Observable<ProjectStatusResponse> {
    return this.http.put<ProjectStatusResponse>(`${this.apiUrl}/${id}`, updates);
  }

  delete(id: string): Observable<ProjectStatusResponse> {
    return this.http.delete<ProjectStatusResponse>(`${this.apiUrl}/${id}`);
  }
}
