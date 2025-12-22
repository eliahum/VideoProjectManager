import Lead from '../models/lead.model';
import Customer from '../models/customer.model';
import { LeadDTO, LeadResponseDTO, LeadsListResponseDTO } from '../dtos/lead.dto';

export const getAllLeads = async (): Promise<LeadsListResponseDTO> => {
    try {
        const leads = await Lead.aggregate([
            {
                $lookup: {
                    from: 'customers',
                    localField: 'leadId',
                    foreignField: 'leadId',
                    as: 'customers'
                }
            },
            {
                $addFields: {
                    hasCustomer: { $gt: [{ $size: '$customers' }, 0] }
                }
            },
            {
                $project: {
                    customers: 0  // Remove customers array from result
                }
            }
        ]);
        
        const data = leads.map((lead) => {
            const { _id, leadId, name, email, phone, statusNumber, source, freeText, companyName, createdAt, hasCustomer } = lead;
            return { 
                id: _id.toString(), 
                leadId, 
                name, 
                email, 
                phone, 
                statusNumber, 
                source, 
                freeText, 
                companyName, 
                createdAt,
                hasCustomer
            };
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
        const { _id, leadId, name, email, phone, statusNumber, source, freeText, companyName } = lead;
        const data = { id: _id.toString(), leadId, name, email, phone, statusNumber, source, freeText, companyName };
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
        const { _id, leadId, name, email, phone, statusNumber, source, freeText, companyName } = savedLead;
        const data = { id: _id.toString(), leadId, name, email, phone, statusNumber, source, freeText, companyName };
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
        const { _id, leadId, name, email, phone, statusNumber, source, freeText, companyName } = updatedLead;
        const data = { id: _id.toString(), leadId, name, email, phone, statusNumber, source, freeText, companyName };
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
        const { _id, leadId, name, email, phone, statusNumber, source, freeText, companyName } = deletedLead;
        const data = { id: _id.toString(), leadId, name, email, phone, statusNumber, source, freeText, companyName };
        return { isSuccess: true, data };
    } catch (error) {
        console.error('[deleteLead] Error deleting lead:', error);
        return { isSuccess: false, errorText: 'Failed to delete lead' };
    }
};