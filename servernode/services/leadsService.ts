import Lead from '../models/lead.model';
import { LeadDTO, LeadResponseDTO, LeadsListResponseDTO } from '../dtos/lead.dto';

export const getAllLeads = async (): Promise<LeadsListResponseDTO> => {
    try {
        const leads = await Lead.find();
        const data = leads.map((lead) => {
            const { _id, name, email, phone, status, source, freeText, companyName,createdAt } = lead;
            return { id: _id.toString(), name, email, phone, status, source, freeText, companyName,createdAt };
        });
        return { isSuccess: true, data };
    } catch (error) {
        console.error('[getAllLeads] Error fetching leads:', error);
        return { isSuccess: false, errorText: 'Failed to fetch leads' };
    }
};

export const getLeadById = async (id: string): Promise<LeadResponseDTO> => {
    try {
        const lead = await Lead.findById(id);
        if (!lead) return { isSuccess: false, errorText: 'Lead not found' };
        const { _id, name, email, phone, status, source, freeText, companyName } = lead;
        const data = { id: _id.toString(), name, email, phone, status, source, freeText, companyName };
        return { isSuccess: true, data };
    } catch (error) {
        console.error('[getLeadById] Error fetching lead:', error);
        return { isSuccess: false, errorText: 'Failed to fetch lead' };
    }
};

export const createLead = async (leadData: Partial<LeadDTO>): Promise<LeadResponseDTO> => {
    try {
        const lead = new Lead(leadData);
        const savedLead = await lead.save();
        const { _id, name, email, phone, status, source, freeText, companyName } = savedLead;
        const data = { id: _id.toString(), name, email, phone, status, source, freeText, companyName };
        return { isSuccess: true, data };
    } catch (error) {
        console.error('[createLead] Error creating lead:', error);
        return { isSuccess: false, errorText: 'Failed to create lead' };
    }
};

export const updateLead = async (id: string, updateData: Partial<LeadDTO>): Promise<LeadResponseDTO> => {
    try {
        const updatedLead = await Lead.findByIdAndUpdate(id, updateData, { new: true });
        if (!updatedLead) return { isSuccess: false, errorText: 'Lead not found' };
        const { _id, name, email, phone, status, source, freeText, companyName } = updatedLead;
        const data = { id: _id.toString(), name, email, phone, status, source, freeText, companyName };
        return { isSuccess: true, data };
    } catch (error) {
        console.error('[updateLead] Error updating lead:', error);
        return { isSuccess: false, errorText: 'Failed to update lead' };
    }
};

export const deleteLead = async (id: string): Promise<LeadResponseDTO> => {
    try {
        const deletedLead = await Lead.findByIdAndDelete(id);
        if (!deletedLead) return { isSuccess: false, errorText: 'Lead not found' };
        const { _id, name, email, phone, status, source, freeText, companyName } = deletedLead;
        const data = { id: _id.toString(), name, email, phone, status, source, freeText, companyName };
        return { isSuccess: true, data };
    } catch (error) {
        console.error('[deleteLead] Error deleting lead:', error);
        return { isSuccess: false, errorText: 'Failed to delete lead' };
    }
};