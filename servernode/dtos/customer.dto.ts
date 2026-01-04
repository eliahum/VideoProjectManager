import { BaseResponseDTO, BaseDataResponseDTO } from './base-response.dto';

export interface ProjectSummaryDTO {
    id: string;
    projectNumber: number;
    projectName: string;
    statusNumber: number;
    statusName: string;
    currentStage: string;
    createdAt: Date;
    paidAmount?: number;
    paymentDate?: Date;
    paymentNote?: string;
}

export interface CustomerDTO {
    id: string; // MongoDB ObjectId as string
    customerId: number; // Auto-increment ID
    name?: string;
    companyName: string;
    email?: string;
    phone: string;
    address?: string;
    leadId?: number; // Lead's auto-increment ID
    howFoundUs?: string; // How the customer found us
    notes?: string; // Free text notes
    projects?: ProjectSummaryDTO[]; // List of customer's projects
}

export interface CustomerResponseDTO extends BaseDataResponseDTO<CustomerDTO> {}

export interface CustomersListResponseDTO extends BaseDataResponseDTO<CustomerDTO[]> {}