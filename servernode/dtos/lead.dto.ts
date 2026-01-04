import { BaseResponseDTO, BaseDataResponseDTO } from './base-response.dto';

export interface LeadDTO {
    id: string; // Updated id to string to match MongoDB ObjectId
    leadId: number; // Auto-increment ID
    name: string;
    email?: string;
    phone?: string;
    statusNumber: number;
    source: string; // איך הגיע אלי
    freeText: string;
    companyName: string;
    priceQuote?: string; // קישור להצעת מחיר ב-Google Drive
    hasCustomer?: boolean; // האם נוצר ממנו לקוח
}

export interface LeadResponseDTO extends BaseDataResponseDTO<LeadDTO> {}

export interface LeadsListResponseDTO extends BaseDataResponseDTO<LeadDTO[]> {}