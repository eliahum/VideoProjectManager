import { BaseDataResponseDTO } from './base-response.dto';

export interface SupplierDTO {
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

export interface SupplierResponseDTO extends BaseDataResponseDTO<SupplierDTO> {}

export interface SupplierListResponseDTO extends BaseDataResponseDTO<SupplierDTO[]> {}
