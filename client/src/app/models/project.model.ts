import { BaseDataResponse } from './base-response.model';

export interface Project {
  _id?: string;
  id: string;
  projectNumber: number;
  customerId: number;
  customerName?: string; // Optional - populated from server lookup
  projectName: string;
  statusNumber: number;
  currentStage: string;
  currentStageNumber: number;
  stages: Stage[];
  currentMilestoneId?: number;
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
}

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
