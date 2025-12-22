import { BaseDataResponse } from './base-response.model';

export interface Customer {
  id: string;
  customerId: number;
  name: string;
  email: string;
  phone: string;
  createdAt: Date;
  updatedAt: Date;
  leadId?: number; // מזהה lead שממנו נוצר הלקוח, אם קיים
}

export interface CustomerResponse extends BaseDataResponse<Customer> {}

export interface CustomersListResponse extends BaseDataResponse<Customer[]> {}
