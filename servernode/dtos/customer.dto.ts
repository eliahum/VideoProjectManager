import { BaseResponseDTO, BaseDataResponseDTO } from './base-response.dto';

export interface CustomerDTO {
    id: string; // MongoDB ObjectId as string
    customerId: number; // Auto-increment ID
    name: string;
    email?: string;
    phone: string;
    address?: string;
    leadId?: number; // Lead's auto-increment ID
}

export interface CustomerResponseDTO extends BaseDataResponseDTO<CustomerDTO> {}

export interface CustomersListResponseDTO extends BaseDataResponseDTO<CustomerDTO[]> {}