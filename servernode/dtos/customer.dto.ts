export interface CustomerDTO {
    id: string; // MongoDB ObjectId as string
    name: string;
    email?: string;
    phone: string;
    address?: string;
    leadId?: string; // MongoDB ObjectId as string
}