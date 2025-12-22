import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LeadStatus, LeadStatusListResponse } from '../models/lead.model';
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
}
