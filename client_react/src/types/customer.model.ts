import type { BaseDataResponse } from './base-response.model';

export interface ProjectSummary {
  projectNumber: number;
  projectName: string;
  statusNumber: number;
  statusName: string;
  currentStage: string;
  createdAt: Date;
}

export interface Customer {
  id: string;
  customerId: number;
  name?: string;
  companyName: string;
  email?: string;
  phone: string;
  createdAt: Date;
  updatedAt: Date;
  leadId?: number;
  projects?: ProjectSummary[];
}

export interface CustomerResponse extends BaseDataResponse<Customer> {}

export interface CustomersListResponse extends BaseDataResponse<Customer[]> {}
