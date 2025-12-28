import LeadStatus from '../models/lead-status.model';
import Lead from '../models/lead.model';
import { LeadStatusDTO, LeadStatusResponseDTO, LeadStatusListResponseDTO } from '../dtos/lead-status.dto';

export const getAllLeadStatuses = async (): Promise<LeadStatusListResponseDTO> => {
    try {
        const statuses = await LeadStatus.find().sort({ statusNumber: 1 });
        const data = statuses.map((status) => {
            const { _id, name, statusNumber, isFinal } = status;
            return { 
                id: _id.toString(), 
                name, 
                statusNumber, 
                isFinal
            };
        });
        return { isSuccess: true, data };
    } catch (error) {
        console.error('[getAllLeadStatuses] Error fetching lead statuses:', error);
        return { isSuccess: false, errorText: 'Failed to fetch lead statuses' };
    }
};

export const getAllLeadStatusesWithCounts = async (): Promise<LeadStatusListResponseDTO> => {
    try {
        const statuses = await LeadStatus.find().sort({ statusNumber: 1 });
        
        // Count leads for each status
        const data = await Promise.all(statuses.map(async (status) => {
            const { _id, name, statusNumber, isFinal } = status;
            const leadCount = await Lead.countDocuments({ statusNumber: statusNumber });
            return { 
                id: _id.toString(), 
                name, 
                statusNumber, 
                isFinal,
                leadCount
            };
        }));
        
        return { isSuccess: true, data };
    } catch (error) {
        console.error('[getAllLeadStatusesWithCounts] Error fetching lead statuses with counts:', error);
        return { isSuccess: false, errorText: 'Failed to fetch lead statuses with counts' };
    }
};

export const getLeadStatusById = async (id: string): Promise<LeadStatusResponseDTO> => {
    try {
        const status = await LeadStatus.findById(id);
        if (!status) return { isSuccess: false, errorText: 'Lead status not found' };
        const { _id, name, statusNumber, isFinal } = status;
        const data = { id: _id.toString(), name, statusNumber, isFinal };
        return { isSuccess: true, data };
    } catch (error) {
        console.error('[getLeadStatusById] Error fetching lead status:', error);
        return { isSuccess: false, errorText: 'Failed to fetch lead status' };
    }
};

export const createLeadStatus = async (statusData: Partial<LeadStatusDTO>): Promise<LeadStatusResponseDTO> => {
    try {
        // Find the highest statusNumber and add 1
        const lastStatus = await LeadStatus.findOne().sort({ statusNumber: -1 });
        const nextStatusNumber = lastStatus ? lastStatus.statusNumber + 1 : 1;
        
        const status = new LeadStatus({
            ...statusData,
            statusNumber: nextStatusNumber
        });
        const savedStatus = await status.save();
        const { _id, name, statusNumber, isFinal } = savedStatus;
        const data = { id: _id.toString(), name, statusNumber, isFinal };
        return { isSuccess: true, data };
    } catch (error) {
        console.error('[createLeadStatus] Error creating lead status:', error);
        return { isSuccess: false, errorText: 'Failed to create lead status' };
    }
};

export const updateLeadStatus = async (id: string, updateData: Partial<LeadStatusDTO>): Promise<LeadStatusResponseDTO> => {
    try {
        const updatedStatus = await LeadStatus.findByIdAndUpdate(id, updateData, { new: true });
        if (!updatedStatus) return { isSuccess: false, errorText: 'Lead status not found' };
        const { _id, name, statusNumber, isFinal } = updatedStatus;
        const data = { id: _id.toString(), name, statusNumber, isFinal };
        return { isSuccess: true, data };
    } catch (error) {
        console.error('[updateLeadStatus] Error updating lead status:', error);
        return { isSuccess: false, errorText: 'Failed to update lead status' };
    }
};

export const deleteLeadStatus = async (id: string): Promise<LeadStatusResponseDTO> => {
    try {
        const deletedStatus = await LeadStatus.findByIdAndDelete(id);
        if (!deletedStatus) return { isSuccess: false, errorText: 'Lead status not found' };
        const { _id, name, statusNumber, isFinal } = deletedStatus;
        const data = { id: _id.toString(), name, statusNumber, isFinal };
        return { isSuccess: true, data };
    } catch (error) {
        console.error('[deleteLeadStatus] Error deleting lead status:', error);
        return { isSuccess: false, errorText: 'Failed to delete lead status' };
    }
};
