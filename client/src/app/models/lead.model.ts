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
  status: LeadStatus;
  notInterestedReason?: string;
  hasCustomer?: boolean; // האם נוצר ממנו לקוח
}

export enum LeadStatus {
  NEW = 'חדש',
  QUOTE = 'הצעת מחיר',
  PAUSED = 'השהייה',
  NOT_INTERESTED = 'לא מעוניין',
  CLOSED = 'סגירה'
}

export interface LeadResponse extends BaseDataResponse<Lead> {}

export interface LeadsListResponse extends BaseDataResponse<Lead[]> {}
