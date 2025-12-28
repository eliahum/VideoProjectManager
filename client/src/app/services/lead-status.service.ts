import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LeadStatus, LeadStatusListResponse, LeadStatusResponse } from '../models/lead.model';
import { API_BASE_URL } from '../../environments/api.config';

@Injectable({
  providedIn: 'root'
})
export class LeadStatusService {
  private apiUrl = `${API_BASE_URL}/api/lead-statuses`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<LeadStatusListResponse> {
    return this.http.get<LeadStatusListResponse>(this.apiUrl);
  }

  getAllWithCounts(): Observable<LeadStatusListResponse> {
    return this.http.get<LeadStatusListResponse>(`${this.apiUrl}/with-counts`);
  }

  getById(id: string): Observable<LeadStatusResponse> {
    return this.http.get<LeadStatusResponse>(`${this.apiUrl}/${id}`);
  }

  create(status: Partial<LeadStatus>): Observable<LeadStatusResponse> {
    return this.http.post<LeadStatusResponse>(this.apiUrl, status);
  }

  update(id: string, updates: Partial<LeadStatus>): Observable<LeadStatusResponse> {
    return this.http.put<LeadStatusResponse>(`${this.apiUrl}/${id}`, updates);
  }

  delete(id: string): Observable<LeadStatusResponse> {
    return this.http.delete<LeadStatusResponse>(`${this.apiUrl}/${id}`);
  }
}
