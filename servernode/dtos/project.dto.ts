import { BaseDataResponseDTO } from "./base-response.dto";

export interface MilestoneSupplierDTO {
  supplierId: string;
  supplierName: string;
  amount: number;
}

export interface MilestoneDTO {
  id: string;
  milestoneId: number;
  name: string;
  documentReference: string;
  date?: Date;
  statusNumber: number;
  status?: string;
  isUrgent: boolean;
  sort: number;
  suppliers: MilestoneSupplierDTO[];
}

export interface StageDTO {
  stageNumber: number;
  stageName: string;
  name: string;
  milestones: MilestoneDTO[];
}

export interface ProjectDTO {
  _id?: string;
  id: string;
  projectNumber: number;
  customerId: string;
  customerName: string;
  projectName: string;
  statusNumber: number;
  currentStage?: string;
  currentStageNumber: number;
  stages: StageDTO[];
  currentMilestoneId?: number;
  initializeAllStages?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ProjectResponseDTO extends BaseDataResponseDTO<ProjectDTO> {}

export interface ProjectListResponseDTO extends BaseDataResponseDTO<ProjectDTO[]> {}
