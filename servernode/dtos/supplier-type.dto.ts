import { BaseDataResponseDTO } from './base-response.dto';

export interface SupplierTypeDTO {
    id: string;
    supplierTypeNumber: number;
    name: string;
    description?: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface SupplierTypeResponseDTO extends BaseDataResponseDTO<SupplierTypeDTO> {}

export interface SupplierTypeListResponseDTO extends BaseDataResponseDTO<SupplierTypeDTO[]> {}
