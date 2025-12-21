import Lead from '../models/lead.model';
import { LeadDTO } from '../dtos/lead.dto';

export const getAllLeads = async (): Promise<LeadDTO[]> => {
    const leads = await Lead.find();
    return leads.map((lead) => {
        const { _id, name, email, phone, status, source, freeText, companyName,createdAt } = lead;
        return { id: _id.toString(), name, email, phone, status, source, freeText, companyName,createdAt };
    });
};

export const getLeadById = async (id: string): Promise<LeadDTO | null> => {
    const lead = await Lead.findById(id);
    if (!lead) return null;
    const { _id, name, email, phone, status, source, freeText, companyName } = lead;
    return { id: _id.toString(), name, email, phone, status, source, freeText, companyName };
};

export const createLead = async (data: Partial<LeadDTO>): Promise<LeadDTO> => {
    try {
        const lead = new Lead(data);
        const savedLead = await lead.save();
        const { _id, name, email, phone, status, source, freeText, companyName } = savedLead;
        return { id: _id.toString(), name, email, phone, status, source, freeText, companyName };
    } catch (error) {
        debugger;
        console.error('Error creating lead:', error);
        throw new Error('Failed to create lead');
    }
};

export const updateLead = async (id: string, data: Partial<LeadDTO>): Promise<LeadDTO | null> => {
    const updatedLead = await Lead.findByIdAndUpdate(id, data, { new: true });
    if (!updatedLead) return null;
    const { _id, name, email, phone, status, source, freeText, companyName } = updatedLead;
    return { id: _id.toString(), name, email, phone, status, source, freeText, companyName };
};

export const deleteLead = async (id: string): Promise<LeadDTO | null> => {
    const deletedLead = await Lead.findByIdAndDelete(id);
    if (!deletedLead) return null;
    const { _id, name, email, phone, status, source, freeText, companyName } = deletedLead;
    return { id: _id.toString(), name, email, phone, status, source, freeText, companyName };
};