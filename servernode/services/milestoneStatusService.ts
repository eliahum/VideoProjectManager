import { MilestoneStatus, IMilestoneStatus } from '../models/milestone-status.model';
import { MilestoneStatusDTO, MilestoneStatusResponseDTO, MilestoneStatusListResponseDTO } from '../dtos/milestone-status.dto';
import { connectToDatabase } from '../utils/db';

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
      const newMilestoneStatus = new MilestoneStatus(milestoneStatusData);
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
      engName: milestoneStatus.engName,
      hebName: milestoneStatus.hebName,
      milestoneStatusNumber: milestoneStatus.milestoneStatusNumber,
      isFinal: milestoneStatus.isFinal,
      isEditable: milestoneStatus.isEditable
    };
  }
}

export const milestoneStatusService = new MilestoneStatusService();
