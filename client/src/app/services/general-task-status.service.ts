import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GeneralTaskStatus } from '../models/general-task-status.model';
import { BaseResponse } from '../models/base-response.model';
import { API_BASE_URL } from '../../environments/api.config';

export interface GeneralTaskStatusListResponse extends BaseResponse {
  data?: GeneralTaskStatus[];
}

export interface GeneralTaskStatusResponse extends BaseResponse {
  data?: GeneralTaskStatus;
}

@Injectable({
  providedIn: 'root'
})
export class GeneralTaskStatusService {
  private apiUrl = `${API_BASE_URL}/api/general-task-statuses`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<GeneralTaskStatusListResponse> {
    return this.http.get<GeneralTaskStatusListResponse>(this.apiUrl);
  }

  getAllWithCounts(): Observable<GeneralTaskStatusListResponse> {
    return this.http.get<GeneralTaskStatusListResponse>(`${this.apiUrl}/with-counts`);
  }

  getById(id: string): Observable<GeneralTaskStatusResponse> {
    return this.http.get<GeneralTaskStatusResponse>(`${this.apiUrl}/${id}`);
  }

  create(status: Partial<GeneralTaskStatus>): Observable<GeneralTaskStatusResponse> {
    return this.http.post<GeneralTaskStatusResponse>(this.apiUrl, status);
  }

  update(id: string, updates: Partial<GeneralTaskStatus>): Observable<GeneralTaskStatusResponse> {
    return this.http.put<GeneralTaskStatusResponse>(`${this.apiUrl}/${id}`, updates);
  }

  delete(id: string): Observable<GeneralTaskStatusResponse> {
    return this.http.delete<GeneralTaskStatusResponse>(`${this.apiUrl}/${id}`);
  }
}
