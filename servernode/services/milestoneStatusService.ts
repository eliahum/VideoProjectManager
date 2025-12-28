import { MilestoneStatus, IMilestoneStatus } from '../models/milestone-status.model';
import { MilestoneStatusDTO, MilestoneStatusResponseDTO, MilestoneStatusListResponseDTO } from '../dtos/milestone-status.dto';
import { connectToDatabase } from '../utils/db';
import { Project } from '../models/project.model';

export class MilestoneStatusService {

  async getAllMilestoneStatuses(): Promise<MilestoneStatusListResponseDTO> {
    try {
      await connectToDatabase();
      const milestoneStatuses = await MilestoneStatus.find().sort({ milestoneStatusNumber: 1 });
      const data: MilestoneStatusDTO[] = milestoneStatuses.map(status => this.mapToDTO(status));
      return { isSuccess: true, data };
    } catch (error: any) {
      return { isSuccess: false, errorText: `Error retrieving milestone statuses: ${error.message}` };
    }
  }

  async getAllMilestoneStatusesWithCounts(): Promise<MilestoneStatusListResponseDTO> {
    try {
      await connectToDatabase();
      const milestoneStatuses = await MilestoneStatus.find().sort({ milestoneStatusNumber: 1 });
      
      // Count milestones for each status across all projects
      const data = await Promise.all(milestoneStatuses.map(async (status) => {
        // Count all milestones in all projects that have this statusNumber
        const projects = await Project.find({});
        let milestoneCount = 0;
        
        projects.forEach(project => {
          project.stages.forEach(stage => {
            stage.milestones.forEach(milestone => {
              if (milestone.statusNumber === status.milestoneStatusNumber) {
                milestoneCount++;
              }
            });
          });
        });
        
        return {
          ...this.mapToDTO(status),
          milestoneCount
        };
      }));
      
      return { isSuccess: true, data };
    } catch (error: any) {
      return { isSuccess: false, errorText: `Error retrieving milestone statuses with counts: ${error.message}` };
    }
  }

  async getMilestoneStatusById(id: number): Promise<MilestoneStatusResponseDTO> {
    try {
      await connectToDatabase();
      const milestoneStatus = await MilestoneStatus.findOne({ id });
      if (!milestoneStatus) {
        return { isSuccess: false, errorText: 'Milestone status not found' };
      }
      const data = this.mapToDTO(milestoneStatus);
      return { isSuccess: true, data };
    } catch (error: any) {
      return { isSuccess: false, errorText: `Error retrieving milestone status: ${error.message}` };
    }
  }

  async createMilestoneStatus(milestoneStatusData: Partial<MilestoneStatusDTO>): Promise<MilestoneStatusResponseDTO> {
    try {
      await connectToDatabase();
      
      // Find the highest id and milestoneStatusNumber and add 1
      const lastStatus = await MilestoneStatus.findOne().sort({ id: -1 });
      const nextId = lastStatus ? lastStatus.id + 1 : 1;
      const nextStatusNumber = lastStatus ? lastStatus.milestoneStatusNumber + 1 : 1;
      
      const newMilestoneStatus = new MilestoneStatus({
        ...milestoneStatusData,
        id: nextId,
        milestoneStatusNumber: nextStatusNumber
      });
      const savedMilestoneStatus = await newMilestoneStatus.save();
      const data = this.mapToDTO(savedMilestoneStatus);
      return { isSuccess: true, data };
    } catch (error: any) {
      return { isSuccess: false, errorText: `Error creating milestone status: ${error.message}` };
    }
  }

  async updateMilestoneStatus(id: number, milestoneStatusData: Partial<MilestoneStatusDTO>): Promise<MilestoneStatusResponseDTO> {
    try {
      await connectToDatabase();
      const updatedMilestoneStatus = await MilestoneStatus.findOneAndUpdate(
        { id },
        milestoneStatusData,
        { new: true }
      );
      if (!updatedMilestoneStatus) {
        return { isSuccess: false, errorText: 'Milestone status not found' };
      }
      const data = this.mapToDTO(updatedMilestoneStatus);
      return { isSuccess: true, data };
    } catch (error: any) {
      return { isSuccess: false, errorText: `Error updating milestone status: ${error.message}` };
    }
  }

  async deleteMilestoneStatus(id: number): Promise<MilestoneStatusResponseDTO> {
    try {
      await connectToDatabase();
      const deletedMilestoneStatus = await MilestoneStatus.findOneAndDelete({ id });
      if (!deletedMilestoneStatus) {
        return { isSuccess: false, errorText: 'Milestone status not found' };
      }
      const data = this.mapToDTO(deletedMilestoneStatus);
      return { isSuccess: true, data };
    } catch (error: any) {
      return { isSuccess: false, errorText: `Error deleting milestone status: ${error.message}` };
    }
  }

  private mapToDTO(milestoneStatus: IMilestoneStatus): MilestoneStatusDTO {
    return {
      _id: milestoneStatus._id?.toString(),
      id: milestoneStatus.id,
      name: milestoneStatus.name,
      milestoneStatusNumber: milestoneStatus.milestoneStatusNumber,
      isFinal: milestoneStatus.isFinal
    };
  }
}

export const milestoneStatusService = new MilestoneStatusService();
