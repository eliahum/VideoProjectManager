import ProjectStatus from '../models/project-status.model';
import { Project } from '../models/project.model';
import { ProjectStatusDTO, ProjectStatusResponseDTO, ProjectStatusListResponseDTO } from '../dtos/project-status.dto';

export const getAllProjectStatuses = async (): Promise<ProjectStatusListResponseDTO> => {
    try {
        const statuses = await ProjectStatus.find().sort({ statusNumber: 1 });
        const data = statuses.map((status) => {
            const { _id, name, status: statusText, statusNumber, isFinal, isPause, isVisible } = status;
            return { 
                id: _id.toString(), 
                name, 
                status: statusText,
                statusNumber, 
                isFinal,
                isPause,
                isVisible
            };
        });
        return { isSuccess: true, data };
    } catch (error) {
        console.error('[getAllProjectStatuses] Error fetching project statuses:', error);
        return { isSuccess: false, errorText: 'Failed to fetch project statuses' };
    }
};

export const getAllProjectStatusesWithCounts = async (): Promise<ProjectStatusListResponseDTO> => {
    try {
        const statuses = await ProjectStatus.find().sort({ statusNumber: 1 });
        
        // Count projects for each status
        const data = await Promise.all(statuses.map(async (status) => {
            const { _id, name, status: statusText, statusNumber, isFinal, isPause, isVisible } = status;
            const projectCount = await Project.countDocuments({ statusNumber: statusNumber });
            return { 
                id: _id.toString(), 
                name, 
                status: statusText,
                statusNumber, 
                isFinal,
                isPause,
                isVisible,
                projectCount
            };
        }));
        
        return { isSuccess: true, data };
    } catch (error) {
        console.error('[getAllProjectStatusesWithCounts] Error fetching project statuses with counts:', error);
        return { isSuccess: false, errorText: 'Failed to fetch project statuses with counts' };
    }
};

export const getProjectStatusById = async (id: string): Promise<ProjectStatusResponseDTO> => {
    try {
        const status = await ProjectStatus.findById(id);
        if (!status) return { isSuccess: false, errorText: 'Project status not found' };
        const { _id, name, status: statusText, statusNumber, isFinal, isPause, isVisible } = status;
        const data = { id: _id.toString(), name, status: statusText, statusNumber, isFinal, isPause, isVisible };
        return { isSuccess: true, data };
    } catch (error) {
        console.error('[getProjectStatusById] Error fetching project status:', error);
        return { isSuccess: false, errorText: 'Failed to fetch project status' };
    }
};

export const createProjectStatus = async (statusData: Partial<ProjectStatusDTO>): Promise<ProjectStatusResponseDTO> => {
    try {
        // Find the highest statusNumber and add 1
        const lastStatus = await ProjectStatus.findOne().sort({ statusNumber: -1 });
        const nextStatusNumber = lastStatus ? lastStatus.statusNumber + 1 : 1;
        
        const status = new ProjectStatus({
            ...statusData,
            status: statusData.name, // status field is same as name
            statusNumber: nextStatusNumber,
            isVisible: true // Always set to true for new statuses
        });
        const savedStatus = await status.save();
        const { _id, name, status: statusText, statusNumber, isFinal, isPause, isVisible } = savedStatus;
        const data = { id: _id.toString(), name, status: statusText, statusNumber, isFinal, isPause, isVisible };
        return { isSuccess: true, data };
    } catch (error) {
        console.error('[createProjectStatus] Error creating project status:', error);
        return { isSuccess: false, errorText: 'Failed to create project status' };
    }
};

export const updateProjectStatus = async (id: string, updateData: Partial<ProjectStatusDTO>): Promise<ProjectStatusResponseDTO> => {
    try {
        const updatedStatus = await ProjectStatus.findByIdAndUpdate(id, updateData, { new: true });
        if (!updatedStatus) return { isSuccess: false, errorText: 'Project status not found' };
        const { _id, name, status: statusText, statusNumber, isFinal, isPause, isVisible } = updatedStatus;
        const data = { id: _id.toString(), name, status: statusText, statusNumber, isFinal, isPause, isVisible };
        return { isSuccess: true, data };
    } catch (error) {
        console.error('[updateProjectStatus] Error updating project status:', error);
        return { isSuccess: false, errorText: 'Failed to update project status' };
    }
};

export const deleteProjectStatus = async (id: string): Promise<ProjectStatusResponseDTO> => {
    try {
        const deletedStatus = await ProjectStatus.findByIdAndDelete(id);
        if (!deletedStatus) return { isSuccess: false, errorText: 'Project status not found' };
        const { _id, name, status: statusText, statusNumber, isFinal, isPause, isVisible } = deletedStatus;
        const data = { id: _id.toString(), name, status: statusText, statusNumber, isFinal, isPause, isVisible };
        return { isSuccess: true, data };
    } catch (error) {
        console.error('[deleteProjectStatus] Error deleting project status:', error);
        return { isSuccess: false, errorText: 'Failed to delete project status' };
    }
};
