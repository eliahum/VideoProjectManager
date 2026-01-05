import { BaseDataResponse } from './base-response.model';

export interface ProjectSummary {
  projectNumber: number;
  projectName: string;
  statusNumber: number;
  statusName: string;
  currentStage: string;
  createdAt: Date;
}

export interface ContactPerson {
  name: string;
  email?: string;
  phone: string;
  role?: string; // תפקיד
  isPrimary?: boolean; // איש קשר ראשי
}

export interface Customer {
  id: string;
  customerId: number;
  name?: string; // שם ראשי - לתאימות לאחור
  companyName: string;
  email?: string; // אימייל ראשי - לתאימות לאחור
  phone: string; // טלפון ראשי - לתאימות לאחור
  contacts?: ContactPerson[]; // רשימת אנשי קשר
  howFoundUs?: string; // איך הגיע אלינו
  notes?: string; // טקסט חופשי
  createdAt: Date;
  updatedAt: Date;
  leadId?: number; // מזהה lead שממנו נוצר הלקוח, אם קיים
  projects?: ProjectSummary[]; // רשימת הפרוייקטים של הלקוח
}

export interface CustomerResponse extends BaseDataResponse<Customer> {}

export interface CustomersListResponse extends BaseDataResponse<Customer[]> {}
