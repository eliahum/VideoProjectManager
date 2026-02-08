import GeneralTaskStatus from '../models/general-task-status.model';
import GeneralTask from '../models/general-task.model';
import { BaseDataResponseDTO } from '../dtos/base-response.dto';

export interface GeneralTaskStatusData {
  id: string;
  name: string;
  statusNumber: number;
  isFinal: boolean;
  taskCount?: number;
}

export const getAllGeneralTaskStatuses = async (): Promise<BaseDataResponseDTO<GeneralTaskStatusData[]>> => {
    try {
        const statuses = await GeneralTaskStatus.find().sort({ statusNumber: 1 });
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
        console.error('[getAllGeneralTaskStatuses] Error fetching statuses:', error);
        return { isSuccess: false, errorText: 'Failed to fetch general task statuses' };
    }
};

export const getAllGeneralTaskStatusesWithCounts = async (): Promise<BaseDataResponseDTO<GeneralTaskStatusData[]>> => {
    try {
        const statuses = await GeneralTaskStatus.find().sort({ statusNumber: 1 });
        
        // Count tasks for each status
        const data = await Promise.all(statuses.map(async (status) => {
            const { _id, name, statusNumber, isFinal } = status;
            const taskCount = await GeneralTask.countDocuments({ statusNumber: statusNumber });
            return { 
                id: _id.toString(), 
                name, 
                statusNumber, 
                isFinal,
                taskCount
            };
        }));
        
        return { isSuccess: true, data };
    } catch (error) {
        console.error('[getAllGeneralTaskStatusesWithCounts] Error fetching statuses with counts:', error);
        return { isSuccess: false, errorText: 'Failed to fetch general task statuses with counts' };
    }
};

export const getGeneralTaskStatusById = async (id: string): Promise<BaseDataResponseDTO<GeneralTaskStatusData>> => {
    try {
        const status = await GeneralTaskStatus.findById(id);
        if (!status) return { isSuccess: false, errorText: 'General task status not found' };
        const { _id, name, statusNumber, isFinal } = status;
        const data = { id: _id.toString(), name, statusNumber, isFinal };
        return { isSuccess: true, data };
    } catch (error) {
        console.error('[getGeneralTaskStatusById] Error fetching status:', error);
        return { isSuccess: false, errorText: 'Failed to fetch general task status' };
    }
};

export const createGeneralTaskStatus = async (statusData: Partial<GeneralTaskStatusData>): Promise<BaseDataResponseDTO<GeneralTaskStatusData>> => {
    try {
        // Find the highest statusNumber and add 1
        const lastStatus = await GeneralTaskStatus.findOne().sort({ statusNumber: -1 });
        const nextStatusNumber = lastStatus ? lastStatus.statusNumber + 1 : 1;
        
        const status = new GeneralTaskStatus({
            ...statusData,
            statusNumber: nextStatusNumber
        });
        const savedStatus = await status.save();
        const { _id, name, statusNumber, isFinal } = savedStatus;
        const data = { id: _id.toString(), name, statusNumber, isFinal };
        return { isSuccess: true, data };
    } catch (error) {
        console.error('[createGeneralTaskStatus] Error creating status:', error);
        return { isSuccess: false, errorText: 'Failed to create general task status' };
    }
};

export const updateGeneralTaskStatus = async (id: string, updateData: Partial<GeneralTaskStatusData>): Promise<BaseDataResponseDTO<GeneralTaskStatusData>> => {
    try {
        const updatedStatus = await GeneralTaskStatus.findByIdAndUpdate(id, updateData, { new: true });
        if (!updatedStatus) return { isSuccess: false, errorText: 'General task status not found' };
        const { _id, name, statusNumber, isFinal } = updatedStatus;
        const data = { id: _id.toString(), name, statusNumber, isFinal };
        return { isSuccess: true, data };
    } catch (error) {
        console.error('[updateGeneralTaskStatus] Error updating status:', error);
        return { isSuccess: false, errorText: 'Failed to update general task status' };
    }
};

export const deleteGeneralTaskStatus = async (id: string): Promise<BaseDataResponseDTO<GeneralTaskStatusData>> => {
    try {
        const deletedStatus = await GeneralTaskStatus.findByIdAndDelete(id);
        if (!deletedStatus) return { isSuccess: false, errorText: 'General task status not found' };
        const { _id, name, statusNumber, isFinal } = deletedStatus;
        const data = { id: _id.toString(), name, statusNumber, isFinal };
        return { isSuccess: true, data };
    } catch (error) {
        console.error('[deleteGeneralTaskStatus] Error deleting status:', error);
        return { isSuccess: false, errorText: 'Failed to delete general task status' };
    }
};

export default {
    getAllGeneralTaskStatuses,
    getAllGeneralTaskStatusesWithCounts,
    getGeneralTaskStatusById,
    createGeneralTaskStatus,
    updateGeneralTaskStatus,
    deleteGeneralTaskStatus
};
