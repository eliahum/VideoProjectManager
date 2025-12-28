import { BaseDataResponse } from './base-response.model';

export interface Lead {
  id: string;
  leadId: number;
  name: string;
  phone: string;
  email?: string;
  source: string; // איך הגיע אלי
  freeText: string;
  companyName: string;
  contactDate: Date;
  createdAt: Date;
  updatedAt: Date;
  statusNumber: number; // מספר הסטטוס
  notInterestedReason?: string;
  hasCustomer?: boolean; // האם נוצר ממנו לקוח
}

export interface LeadStatus {
  id: string;
  name: string; // שם הסטטוס
  statusNumber: number; // מספר הסטטוס
  isFinal: boolean; // האם סטטוס סופי
  leadCount?: number; // מספר הלידים המשתמשים בסטטוס
}

export interface LeadResponse extends BaseDataResponse<Lead> {}

export interface LeadsListResponse extends BaseDataResponse<Lead[]> {}

export interface LeadStatusResponse extends BaseDataResponse<LeadStatus> {}

export interface LeadStatusListResponse extends BaseDataResponse<LeadStatus[]> {}

