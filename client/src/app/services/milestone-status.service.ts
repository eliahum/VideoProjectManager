import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MilestoneStatus, MilestoneStatusResponse, MilestoneStatusListResponse } from '../models/milestone-status.model';
import { API_BASE_URL } from '../../environments/api.config';

@Injectable({
  providedIn: 'root'
})
export class MilestoneStatusService {
  private apiUrl = `${API_BASE_URL}/api/milestone-statuses`;

  constructor(private http: HttpClient) {}

  getAllMilestoneStatuses(): Observable<MilestoneStatusListResponse> {
    return this.http.get<MilestoneStatusListResponse>(this.apiUrl);
  }

  getMilestoneStatusById(id: number): Observable<MilestoneStatusResponse> {
    return this.http.get<MilestoneStatusResponse>(`${this.apiUrl}/${id}`);
  }

  createMilestoneStatus(milestoneStatus: Partial<MilestoneStatus>): Observable<MilestoneStatusResponse> {
    return this.http.post<MilestoneStatusResponse>(this.apiUrl, milestoneStatus);
  }

  updateMilestoneStatus(id: number, milestoneStatus: Partial<MilestoneStatus>): Observable<MilestoneStatusResponse> {
    return this.http.put<MilestoneStatusResponse>(`${this.apiUrl}/${id}`, milestoneStatus);
  }

  deleteMilestoneStatus(id: number): Observable<MilestoneStatusResponse> {
    return this.http.delete<MilestoneStatusResponse>(`${this.apiUrl}/${id}`);
  }
}
