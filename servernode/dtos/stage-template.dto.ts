import { BaseDataResponseDTO } from "./base-response.dto";

export interface StageTemplateDTO {
  _id?: string;
  id: number;
  name: string;
  engName: string;
  hebName: string;
  stageNumber: number;
  milestoneNames: string[];
}

export interface StageTemplateResponseDTO extends BaseDataResponseDTO<StageTemplateDTO> {}

export interface StageTemplateListResponseDTO extends BaseDataResponseDTO<StageTemplateDTO[]> {}
