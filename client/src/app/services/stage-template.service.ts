import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StageTemplate, StageTemplateResponse, StageTemplateListResponse } from '../models/stage-template.model';
import { API_BASE_URL } from '../../environments/api.config';

@Injectable({
  providedIn: 'root'
})
export class StageTemplateService {
  private apiUrl = `${API_BASE_URL}/api/stage-templates`;

  constructor(private http: HttpClient) {}

  getAllStageTemplates(): Observable<StageTemplateListResponse> {
    return this.http.get<StageTemplateListResponse>(this.apiUrl);
  }

  getStageTemplateById(id: number): Observable<StageTemplateResponse> {
    return this.http.get<StageTemplateResponse>(`${this.apiUrl}/${id}`);
  }

  createStageTemplate(stageTemplate: Partial<StageTemplate>): Observable<StageTemplateResponse> {
    return this.http.post<StageTemplateResponse>(this.apiUrl, stageTemplate);
  }

  updateStageTemplate(id: number, stageTemplate: Partial<StageTemplate>): Observable<StageTemplateResponse> {
    return this.http.put<StageTemplateResponse>(`${this.apiUrl}/${id}`, stageTemplate);
  }

  deleteStageTemplate(id: number): Observable<StageTemplateResponse> {
    return this.http.delete<StageTemplateResponse>(`${this.apiUrl}/${id}`);
  }
}
