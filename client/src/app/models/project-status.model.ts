import { BaseDataResponse } from './base-response.model';

export interface ProjectStatus {
    id: string;
    name: string; // שם הסטטוס
    status: string; // סטטוס
    statusNumber: number; // מספר הסטטוס
    isFinal: boolean; // האם סטטוס סופי
    isPause: boolean; // האם סטטוס השהיה
    isVisible: boolean; // האם הסטטוס גלוי
    projectCount?: number; // סך פרויקטים בשימוש
}

export interface ProjectStatusResponse extends BaseDataResponse<ProjectStatus> {}

export interface ProjectStatusListResponse extends BaseDataResponse<ProjectStatus[]> {}
