import { BaseDataResponse } from './base-response.model';

export interface MilestoneStatus {
  _id?: string;
  id: number;
  name: string;
  milestoneStatusNumber: number;
  isFinal: boolean;
  isEditable: boolean;
}

export interface MilestoneStatusResponse extends BaseDataResponse<MilestoneStatus> {}

export interface MilestoneStatusListResponse extends BaseDataResponse<MilestoneStatus[]> {}
