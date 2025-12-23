import { BaseDataResponseDTO } from './base-response.dto';
import { SupplierTypeDTO } from './supplier-type.dto';

export interface SupplierDTO {
    id: string;
    supplierNumber: number;
    name: string;
    phone: string;
    email: string;
    supplierType?: SupplierTypeDTO;
    accountDetails: string;
    isPaid: boolean;
    notes: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface SupplierResponseDTO extends BaseDataResponseDTO<SupplierDTO> {}

export interface SupplierListResponseDTO extends BaseDataResponseDTO<SupplierDTO[]> {}
