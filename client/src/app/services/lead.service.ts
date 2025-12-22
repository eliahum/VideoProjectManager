import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Lead, LeadStatus, LeadResponse, LeadsListResponse } from '../models/lead.model';
import { API_BASE_URL } from '../../environments/api.config';

@Injectable({
  providedIn: 'root'
})
export class LeadService {
  private apiUrl = `${API_BASE_URL}/api/leads`; // Adjust port if needed


  constructor(private http: HttpClient) {}

  getAll(): Observable<LeadsListResponse> {
    return this.http.get<LeadsListResponse>(this.apiUrl);
  }

  getById(id: string): Observable<LeadResponse> {
    return this.http.get<LeadResponse>(`${this.apiUrl}/${id}`);
  }

  create(lead: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>): Observable<LeadResponse> {
    return this.http.post<LeadResponse>(this.apiUrl, lead);
  }

  update(id: string, updates: Partial<Lead>): Observable<LeadResponse> {
    return this.http.put<LeadResponse>(`${this.apiUrl}/${id}`, updates);
  }

  updateStatus(id: string, status: LeadStatus): Observable<LeadResponse> {
    return this.http.put<LeadResponse>(`${this.apiUrl}/${id}/status`, { status });
  }

  delete(id: string): Observable<LeadResponse> {
    return this.http.delete<LeadResponse>(`${this.apiUrl}/${id}`);
  }

  // No need for generateId, handled by backend
}
