export interface LeadDTO {
    id: string; // Updated id to string to match MongoDB ObjectId
    name: string;
    email?: string;
    phone?: string;
    status: string;
    source: string; // איך הגיע אלי
  freeText: string;
  companyName: string;
  
}