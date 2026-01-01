import type { BaseDataResponse } from './base-response.model';

export interface SupplierType {
  id: string;
  supplierTypeNumber: number;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

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

export interface SupplierTypeResponse extends BaseDataResponse<SupplierType> {}

export interface SupplierTypeListResponse extends BaseDataResponse<SupplierType[]> {}
