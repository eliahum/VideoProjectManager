import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../../environments/api.config';

export interface BackupInfo {
  timestamp: string;
  filename: string;
  size: number;
  status: 'success' | 'failed' | 'in-progress';
  uploadedToCloud: boolean;
  error?: string;
}

export interface BackupResponse {
  success: boolean;
  message: string;
  backup?: BackupInfo;
}

export interface BackupHistoryResponse {
  success: boolean;
  backups: BackupInfo[];
}

export interface BackupScheduleInfo {
  enabled: boolean;
  cronExpression: string;
  timezone: string;
  nextRun?: string;
  description: string;
}

@Injectable({
  providedIn: 'root'
})
export class BackupService {
  private apiUrl = `${API_BASE_URL}/api/backups`;

  constructor(private http: HttpClient) {}

  /**
   * יצירת גיבוי ידני
   */
  createBackup(): Observable<BackupResponse> {
    return this.http.post<BackupResponse>(`${this.apiUrl}/create`, {});
  }

  /**
   * קבלת היסטוריית גיבויים
   */
  getBackupHistory(): Observable<BackupHistoryResponse> {
    return this.http.get<BackupHistoryResponse>(`${this.apiUrl}/history`);
  }

  /**
   * קבלת מידע על הגיבוי האחרון
   */
  getLastBackup(): Observable<BackupInfo | null> {
    return this.http.get<BackupInfo | null>(`${this.apiUrl}/last`);
  }

  /**
   * הורדת קובץ גיבוי
   */
  downloadBackup(filename: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/download/${filename}`, {
      responseType: 'blob'
    });
  }

  /**
   * קבלת מידע על לוח הזמנים האוטומטי
   */
  getScheduleInfo(): Observable<BackupScheduleInfo> {
    return this.http.get<BackupScheduleInfo>(`${this.apiUrl}/schedule`);
  }
}
