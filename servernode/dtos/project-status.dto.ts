import { BaseDataResponseDTO } from './base-response.dto';

export interface ProjectStatusDTO {
    id: string;
    name: string; // שם הסטטוס
    status: string; // סטטוס
    statusNumber: number; // מספר הסטטוס
    isFinal: boolean; // האם סטטוס סופי
    isPause: boolean; // האם סטטוס השהיה
    isVisible: boolean; // האם הסטטוס גלוי
    projectCount?: number; // סך פרויקטים בשימוש
}

export interface ProjectStatusResponseDTO extends BaseDataResponseDTO<ProjectStatusDTO> {}

export interface ProjectStatusListResponseDTO extends BaseDataResponseDTO<ProjectStatusDTO[]> {}
