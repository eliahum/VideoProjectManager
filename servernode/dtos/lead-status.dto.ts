import { BaseDataResponseDTO } from './base-response.dto';

export interface LeadStatusDTO {
    id: string;
    name: string; // שם הסטטוס
    statusNumber: number; // מספר הסטטוס
    isFinal: boolean; // האם סטטוס סופי
    isEditable: boolean; // האם ניתן לעדכן
}

export interface LeadStatusResponseDTO extends BaseDataResponseDTO<LeadStatusDTO> {}

export interface LeadStatusListResponseDTO extends BaseDataResponseDTO<LeadStatusDTO[]> {}
