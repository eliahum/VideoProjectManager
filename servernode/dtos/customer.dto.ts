import { BaseResponseDTO, BaseDataResponseDTO } from './base-response.dto';

export interface ProjectSummaryDTO {
    projectNumber: number;
    projectName: string;
    statusNumber: number;
    statusName: string;
    currentStage: string;
    createdAt: Date;
}

export interface CustomerDTO {
    id: string; // MongoDB ObjectId as string
    customerId: number; // Auto-increment ID
    name: string;
    email?: string;
    phone: string;
    address?: string;
    leadId?: number; // Lead's auto-increment ID
    projects?: ProjectSummaryDTO[]; // List of customer's projects
}

export interface CustomerResponseDTO extends BaseDataResponseDTO<CustomerDTO> {}

export interface CustomersListResponseDTO extends BaseDataResponseDTO<CustomerDTO[]> {}