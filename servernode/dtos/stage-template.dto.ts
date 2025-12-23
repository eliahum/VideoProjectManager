import { BaseDataResponseDTO } from "./base-response.dto";

export interface MilestoneTemplateDTO {
  id: number;
  name: string;
}

export interface StageTemplateDTO {
  _id?: string;
  id: number;
  name: string;
  engName: string;
  hebName: string;
  stageNumber: number;
  milestones: MilestoneTemplateDTO[];
}

export interface StageTemplateResponseDTO extends BaseDataResponseDTO<StageTemplateDTO> {}

export interface StageTemplateListResponseDTO extends BaseDataResponseDTO<StageTemplateDTO[]> {}
