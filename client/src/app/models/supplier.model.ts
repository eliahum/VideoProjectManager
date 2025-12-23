import { BaseDataResponse } from './base-response.model';
import { SupplierType } from './supplier-type.model';

export interface Supplier {
  id: string;
  supplierNumber: number;
  name: string;
  phone: string;
  email: string;
  supplierType?: SupplierType;
  accountDetails: string;
  isPaid: boolean;
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface SupplierResponse extends BaseDataResponse<Supplier> {}

export interface SuppliersListResponse extends BaseDataResponse<Supplier[]> {}
