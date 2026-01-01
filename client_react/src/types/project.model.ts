import type { BaseDataResponse } from './base-response.model';

export interface Project {
  _id?: string;
  id: string;
  projectNumber: number;
  customerId: number | string;
  customerName?: string;
  projectName: string;
  statusNumber: number;
  currentStage: string;
  currentStageNumber: number;
  stages: Stage[];
  currentMilestoneId?: number;
  paidAmount?: number;
  paymentDate?: Date;
  paymentNote?: string;
  initializeAllStages?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ProjectResponse extends BaseDataResponse<Project> {}

export interface ProjectListResponse extends BaseDataResponse<Project[]> {}

export interface Stage {
  stageNumber: number;
  stageName: string;
  name: string;
  milestones: Milestone[];
}

export interface Milestone {
  id: string;
  milestoneId: number;
  stageNumber?: number;
  name: string;
  documentReference: string;
  statusNumber: number;
  date?: Date;
  status?: string;
  isUrgent: boolean;
  sort: number;
  suppliers: MilestoneSupplier[];
}

export interface MilestoneSupplier {
  supplierId: string;
  supplierName: string;
  amount: number;
  isPaid?: boolean;
  date?: Date;
}

export interface ProjectStatus {
  id: string;
  name: string;
  statusNumber: number;
  projectCount?: number;
}

export interface MilestoneStatus {
  id: string;
  name: string;
  statusNumber: number;
  milestoneCount?: number;
}

export interface StageTemplate {
  id: string;
  stageNumber: number;
  name: string;
  milestones: string[];
}

export interface ProjectStatusResponse extends BaseDataResponse<ProjectStatus> {}

export interface ProjectStatusListResponse extends BaseDataResponse<ProjectStatus[]> {}

export interface MilestoneStatusResponse extends BaseDataResponse<MilestoneStatus> {}

export interface MilestoneStatusListResponse extends BaseDataResponse<MilestoneStatus[]> {}

export interface StageTemplateResponse extends BaseDataResponse<StageTemplate> {}

export interface StageTemplateListResponse extends BaseDataResponse<StageTemplate[]> {}

export const PRE_MILESTONES = [
  'הצעת מחיר',
  'תשלום מקדמה',
  'חשבונית מקדמה',
  'פגישת אסטרטגיה',
  'פיצוח קונספטים',
  'משוב קונספטים',
  'תסריט',
  'משוב תסריט'
];

export const PRODUCTION_MILESTONES = [
  'תאום תאריך הפקה',
  'תאום צילום',
  'תאום תאורה',
  'תאום עוזר הפקה',
  'תאום בימוי',
  'תאום שחקנים',
  'תאום לוקיישן',
  'תאום איפור',
  'תאום תלבושות',
  'תאום ארט',
  'הפקה בפועל'
];

export const POST_MILESTONES = [
  'מיון חומר גלם',
  'ראפקאט'
];
