import type { BaseDataResponse } from './base-response.model';

export interface Lead {
  id: string;
  leadId: number;
  name: string;
  phone: string;
  email?: string;
  source: string;
  freeText: string;
  companyName: string;
  contactDate: Date;
  createdAt: Date;
  updatedAt: Date;
  statusNumber: number;
  notInterestedReason?: string;
  hasCustomer?: boolean;
}

export interface LeadStatus {
  id: string;
  name: string;
  statusNumber: number;
  isFinal: boolean;
  leadCount?: number;
}

export interface LeadResponse extends BaseDataResponse<Lead> {}

export interface LeadsListResponse extends BaseDataResponse<Lead[]> {}

export interface LeadStatusResponse extends BaseDataResponse<LeadStatus> {}

export interface LeadStatusListResponse extends BaseDataResponse<LeadStatus[]> {}
