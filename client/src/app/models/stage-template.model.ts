import { BaseDataResponse } from './base-response.model';

export interface MilestoneTemplate {
  id: number;
  name: string;
}

export interface StageTemplate {
  _id?: string;
  id: number;
  name: string;
  engName: string;
  hebName: string;
  stageNumber: number;
  milestones: MilestoneTemplate[];
}

export interface StageTemplateResponse extends BaseDataResponse<StageTemplate> {}

export interface StageTemplateListResponse extends BaseDataResponse<StageTemplate[]> {}
