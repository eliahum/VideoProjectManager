import { BaseDataResponseDTO } from "./base-response.dto";

export interface MilestoneSupplierDTO {
  supplierId: string;
  supplierName: string;
  amount: number;
}

export interface MilestoneDTO {
  id: string;
  name: string;
  documentReference: string;
  date?: Date;
  statusNumber: number;
  suppliers: MilestoneSupplierDTO[];
}

export interface StageDTO {
  stageNumber: number;
  stageName: string;
  milestones: MilestoneDTO[];
}

export interface ProjectDTO {
  _id?: string;
  id: string;
  projectNumber: number;
  customerId: string;
  customerName: string;
  projectType: string;
  currentStageNumber: number;
  stages: StageDTO[];
  currentMilestoneId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ProjectResponseDTO extends BaseDataResponseDTO<ProjectDTO> {}

export interface ProjectListResponseDTO extends BaseDataResponseDTO<ProjectDTO[]> {}
