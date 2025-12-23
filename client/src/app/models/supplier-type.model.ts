export interface SupplierType {
  id: string;
  supplierTypeNumber: number;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
