import { BaseDataResponse } from './base-response.model';

export interface StageTemplate {
  _id?: string;
  id: number;
  name: string;
  engName: string;
  hebName: string;
  stageNumber: number;
  milestoneNames: string[];
}

export interface StageTemplateResponse extends BaseDataResponse<StageTemplate> {}

export interface StageTemplateListResponse extends BaseDataResponse<StageTemplate[]> {}
