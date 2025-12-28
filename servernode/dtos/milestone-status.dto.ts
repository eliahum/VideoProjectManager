import { BaseDataResponseDTO } from "./base-response.dto";

export interface MilestoneStatusDTO {
  _id?: string;
  id: number;
  name: string;
  milestoneStatusNumber: number;
  isFinal: boolean;
  milestoneCount?: number;
}

export interface MilestoneStatusResponseDTO extends BaseDataResponseDTO<MilestoneStatusDTO> {}

export interface MilestoneStatusListResponseDTO extends BaseDataResponseDTO<MilestoneStatusDTO[]> {}
