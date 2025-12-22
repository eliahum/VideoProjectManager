import { BaseDataResponse } from './base-response.model';

export interface Project {
  _id?: string;
  id: string;
  projectNumber: number;
  customerId: string;
  customerName: string;
  projectType: string;
  currentStage: ProjectStage;
  currentStageNumber: number;
  stages: Stage[];
  currentMilestoneId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ProjectResponse extends BaseDataResponse<Project> {}

export interface ProjectListResponse extends BaseDataResponse<Project[]> {}

export enum ProjectStage {
  PRE = 'פרה',
  PRODUCTION = 'פרודקשן',
  POST = 'פוסט'
}

export interface Stage {
  stageNumber: number;
  stageName: string;
  name: ProjectStage;
  milestones: Milestone[];
}

export interface Milestone {
  id: string;
  name: string;
  documentReference: string;
  statusNumber: number;
  date?: Date;
  status: MilestoneStatus;
  suppliers: MilestoneSupplier[];
}

export interface MilestoneSupplier {
  supplierId: string;
  supplierName: string;
  amount: number;
}

export enum MilestoneStatus {
  BEFORE_START = 'לפני התחלה',
  WORKING = 'בעבודה',
  WITH_CLIENT = 'אצל הלקוח',
  COMPLETED = 'הושלם'
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
