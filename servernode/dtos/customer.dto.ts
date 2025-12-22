import { BaseResponseDTO, BaseDataResponseDTO } from './base-response.dto';

export interface CustomerDTO {
    id: string; // MongoDB ObjectId as string
    name: string;
    email?: string;
    phone: string;
    address?: string;
    leadId?: string; // MongoDB ObjectId as string
}

export interface CustomerResponseDTO extends BaseDataResponseDTO<CustomerDTO> {}

export interface CustomersListResponseDTO extends BaseDataResponseDTO<CustomerDTO[]> {}