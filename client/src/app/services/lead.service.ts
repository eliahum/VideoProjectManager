import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Lead, LeadStatus } from '../models/lead.model';
import { API_BASE_URL } from '../../environments/api.config';

@Injectable({
  providedIn: 'root'
})
export class LeadService {
  private apiUrl = `${API_BASE_URL}/api/leads`; // Adjust port if needed


  constructor(private http: HttpClient) {}

  getAll(): Observable<Lead[]> {
    return this.http.get<Lead[]>(this.apiUrl);
  }

  getById(id: number): Observable<Lead> {
    return this.http.get<Lead>(`${this.apiUrl}/${id}`);
  }

  create(lead: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>): Observable<Lead> {
    return this.http.post<Lead>(this.apiUrl, lead);
  }

  update(id: string, updates: Partial<Lead>): Observable<Lead> {
    return this.http.put<Lead>(`${this.apiUrl}/${id}`, updates);
  }

  updateStatus(id: string, status: LeadStatus): Observable<Lead> {
    return this.http.put<Lead>(`${this.apiUrl}/${id}/status`, { status });
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // No need for generateId, handled by backend
}
