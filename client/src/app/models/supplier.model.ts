import { BaseDataResponse } from './base-response.model';

export interface Supplier {
  id: string;
  supplierNumber: number;
  name: string;
  phone: string;
  email: string;
  accountDetails: string;
  isPaid: boolean;
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface SupplierResponse extends BaseDataResponse<Supplier> {}

export interface SuppliersListResponse extends BaseDataResponse<Supplier[]> {}
