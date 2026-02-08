import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GeneralTask } from '../models/general-task.model';
import { BaseResponse } from '../models/base-response.model';
import { API_BASE_URL } from '../../environments/api.config';

export interface GeneralTaskListResponse extends BaseResponse {
  data?: GeneralTask[];
}

export interface GeneralTaskResponse extends BaseResponse {
  data?: GeneralTask;
}

@Injectable({
  providedIn: 'root'
})
export class GeneralTaskService {
  private apiUrl = `${API_BASE_URL}/api/general-tasks`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<GeneralTaskListResponse> {
    return this.http.get<GeneralTaskListResponse>(this.apiUrl);
  }

  getById(id: string): Observable<GeneralTaskResponse> {
    return this.http.get<GeneralTaskResponse>(`${this.apiUrl}/${id}`);
  }

  create(task: Partial<GeneralTask>): Observable<GeneralTaskResponse> {
    return this.http.post<GeneralTaskResponse>(this.apiUrl, task);
  }

  update(id: string, updates: Partial<GeneralTask>): Observable<GeneralTaskResponse> {
    return this.http.put<GeneralTaskResponse>(`${this.apiUrl}/${id}`, updates);
  }

  delete(id: string): Observable<GeneralTaskResponse> {
    return this.http.delete<GeneralTaskResponse>(`${this.apiUrl}/${id}`);
  }
}
