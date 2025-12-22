import { BaseDataResponseDTO } from "./base-response.dto";

export interface MilestoneStatusDTO {
  _id?: string;
  id: number;
  name: string;
  engName: string;
  hebName: string;
  milestoneStatusNumber: number;
  isFinal: boolean;
  isEditable: boolean;
}

export interface MilestoneStatusResponseDTO extends BaseDataResponseDTO<MilestoneStatusDTO> {}

export interface MilestoneStatusListResponseDTO extends BaseDataResponseDTO<MilestoneStatusDTO[]> {}
