import { StageTemplate, IStageTemplate } from '../models/stage-template.model';
import { StageTemplateDTO, StageTemplateResponseDTO, StageTemplateListResponseDTO } from '../dtos/stage-template.dto';
import { connectToDatabase } from '../utils/db';

export class StageTemplateService {

  async getAllStageTemplates(): Promise<StageTemplateListResponseDTO> {
    try {
      await connectToDatabase();
      const stageTemplates = await StageTemplate.find().sort({ stageNumber: 1 });
      const data: StageTemplateDTO[] = stageTemplates.map(template => this.mapToDTO(template));
      return { isSuccess: true, data };
    } catch (error: any) {
      return { isSuccess: false, errorText: `Error retrieving stage templates: ${error.message}` };
    }
  }

  async getStageTemplateById(id: number): Promise<StageTemplateResponseDTO> {
    try {
      await connectToDatabase();
      const stageTemplate = await StageTemplate.findOne({ id });
      if (!stageTemplate) {
        return { isSuccess: false, errorText: 'Stage template not found' };
      }
      const data = this.mapToDTO(stageTemplate);
      return { isSuccess: true, data };
    } catch (error: any) {
      return { isSuccess: false, errorText: `Error retrieving stage template: ${error.message}` };
    }
  }

  async createStageTemplate(stageTemplateData: Partial<StageTemplateDTO>): Promise<StageTemplateResponseDTO> {
    try {
      await connectToDatabase();
      const newStageTemplate = new StageTemplate(stageTemplateData);
      const savedStageTemplate = await newStageTemplate.save();
      const data = this.mapToDTO(savedStageTemplate);
      return { isSuccess: true, data };
    } catch (error: any) {
      return { isSuccess: false, errorText: `Error creating stage template: ${error.message}` };
    }
  }

  async updateStageTemplate(id: number, stageTemplateData: Partial<StageTemplateDTO>): Promise<StageTemplateResponseDTO> {
    try {
      await connectToDatabase();
      const updatedStageTemplate = await StageTemplate.findOneAndUpdate(
        { id },
        stageTemplateData,
        { new: true }
      );
      if (!updatedStageTemplate) {
        return { isSuccess: false, errorText: 'Stage template not found' };
      }
      const data = this.mapToDTO(updatedStageTemplate);
      return { isSuccess: true, data };
    } catch (error: any) {
      return { isSuccess: false, errorText: `Error updating stage template: ${error.message}` };
    }
  }

  async deleteStageTemplate(id: number): Promise<StageTemplateResponseDTO> {
    try {
      await connectToDatabase();
      const deletedStageTemplate = await StageTemplate.findOneAndDelete({ id });
      if (!deletedStageTemplate) {
        return { isSuccess: false, errorText: 'Stage template not found' };
      }
      const data = this.mapToDTO(deletedStageTemplate);
      return { isSuccess: true, data };
    } catch (error: any) {
      return { isSuccess: false, errorText: `Error deleting stage template: ${error.message}` };
    }
  }

  private  mapToDTO(stageTemplate: IStageTemplate): StageTemplateDTO {
    return {
      _id: stageTemplate._id?.toString(),
      id: stageTemplate.id,
      name: stageTemplate.name,
      engName: stageTemplate.engName,
      hebName: stageTemplate.hebName,
      stageNumber: stageTemplate.stageNumber,
      milestones: stageTemplate.milestones
    };
  }
}

export const stageTemplateService = new StageTemplateService();
