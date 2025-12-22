import { Project, IProject } from '../models/project.model';
import { ProjectDTO, ProjectResponseDTO, ProjectListResponseDTO } from '../dtos/project.dto';
import { connectToDatabase } from '../utils/db';

export class ProjectsService {

  async getAllProjects(): Promise<ProjectListResponseDTO> {
    try {
      await connectToDatabase();
      const projects = await Project.find().sort({ projectNumber: -1 });
      const data: ProjectDTO[] = projects.map(project => this.mapToDTO(project));
      return { isSuccess: true, data };
    } catch (error: any) {
      return { isSuccess: false, errorText: `Error retrieving projects: ${error.message}` };
    }
  }

  async getProjectById(id: string): Promise<ProjectResponseDTO> {
    try {
      await connectToDatabase();
      const project = await Project.findOne({ id });
      if (!project) {
        return { isSuccess: false, errorText: 'Project not found' };
      }
      const data = this.mapToDTO(project);
      return { isSuccess: true, data };
    } catch (error: any) {
      return { isSuccess: false, errorText: `Error retrieving project: ${error.message}` };
    }
  }

  async createProject(projectData: Partial<ProjectDTO>): Promise<ProjectResponseDTO> {
    try {
      await connectToDatabase();
      const newProject = new Project(projectData);
      const savedProject = await newProject.save();
      const data = this.mapToDTO(savedProject);
      return { isSuccess: true, data };
    } catch (error: any) {
      return { isSuccess: false, errorText: `Error creating project: ${error.message}` };
    }
  }

  async updateProject(id: string, projectData: Partial<ProjectDTO>): Promise<ProjectResponseDTO> {
    try {
      await connectToDatabase();
      const updatedProject = await Project.findOneAndUpdate(
        { id },
        projectData,
        { new: true }
      );
      if (!updatedProject) {
        return { isSuccess: false, errorText: 'Project not found' };
      }
      const data = this.mapToDTO(updatedProject);
      return { isSuccess: true, data };
    } catch (error: any) {
      return { isSuccess: false, errorText: `Error updating project: ${error.message}` };
    }
  }

  async deleteProject(id: string): Promise<ProjectResponseDTO> {
    try {
      await connectToDatabase();
      const deletedProject = await Project.findOneAndDelete({ id });
      if (!deletedProject) {
        return { isSuccess: false, errorText: 'Project not found' };
      }
      const data = this.mapToDTO(deletedProject);
      return { isSuccess: true, data };
    } catch (error: any) {
      return { isSuccess: false, errorText: `Error deleting project: ${error.message}` };
    }
  }

  private mapToDTO(project: IProject): ProjectDTO {
    return {
      _id: project._id?.toString(),
      id: project.id,
      projectNumber: project.projectNumber,
      customerId: project.customerId,
      customerName: project.customerName,
      projectType: project.projectType,
      currentStageNumber: project.currentStageNumber,
      stages: project.stages.map(stage => ({
        stageNumber: stage.stageNumber,
        stageName: stage.stageName,
        milestones: stage.milestones.map(milestone => ({
          id: milestone.id,
          name: milestone.name,
          documentReference: milestone.documentReference,
          date: milestone.date,
          statusNumber: milestone.statusNumber,
          suppliers: milestone.suppliers.map(supplier => ({
            supplierId: supplier.supplierId,
            supplierName: supplier.supplierName,
            amount: supplier.amount
          }))
        }))
      })),
      currentMilestoneId: project.currentMilestoneId,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt
    };
  }
}

export const projectsService = new ProjectsService();
