export interface Lead {
  id: string;
  name: string;
  phone: string;
  email?: string;
  source: string; // איך הגיע אלי
  freeText: string;
  companyName: string;
  contactDate: Date;
  createdAt: Date;
  updatedAt: Date;
  status: LeadStatus;
  notInterestedReason?: string;
}

export enum LeadStatus {
  NEW = 'חדש',
  QUOTE = 'הצעת מחיר',
  PAUSED = 'השהייה',
  NOT_INTERESTED = 'לא מעוניין',
  CLOSED = 'סגירה'
}
