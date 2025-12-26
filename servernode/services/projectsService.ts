import { Project, IProject } from '../models/project.model';
import Customer from '../models/customer.model';
import { ProjectDTO, ProjectResponseDTO, ProjectListResponseDTO, StageDTO, MilestoneDTO, MilestoneSupplierDTO } from '../dtos/project.dto';
import { connectToDatabase } from '../utils/db';
import { stageTemplateService } from './stageTemplateService';
import { milestoneStatusService } from './milestoneStatusService';

export class ProjectsService {

  async getAllProjects(): Promise<ProjectListResponseDTO> {
    try {
      await connectToDatabase();
      const projects = await Project.find().populate('customerId').sort({ projectNumber: -1 });
      const data: ProjectDTO[] = await Promise.all(
        projects.map(async project => await this.mapToDTO(project))
      );
      return { isSuccess: true, data };
    } catch (error: any) {
      return { isSuccess: false, errorText: `Error retrieving projects: ${error.message}` };
    }
  }

  async getProjectById(id: string): Promise<ProjectResponseDTO> {
    try {
      await connectToDatabase();
      const project = await Project.findOne({ id }).populate('customerId');
      if (!project) {
        return { isSuccess: false, errorText: 'Project not found' };
      }
      const data = await this.mapToDTO(project);
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
      
      // אם המשתמש ביקש לאתחל את כל השלבים - נעשה זאת אחרי ה-save כדי שיהיה לנו ID
      if (projectData.initializeAllStages) {
        const templatesResponse = await stageTemplateService.getAllStageTemplates();
        if (templatesResponse.isSuccess && templatesResponse.data) {
          const stages = templatesResponse.data.map(template => ({
            stageNumber: template.stageNumber,
            stageName: template.hebName,
            milestones: template.milestones.map((m, index) => ({
              id: `${savedProject.id}-${template.stageNumber}-${m.id}`,
              milestoneId: m.id,
              name: m.name,
              documentReference: '',
              statusNumber: 1,
              isUrgent: false,
              sort: index,
              date: undefined as Date | undefined,
              suppliers: [] as MilestoneSupplierDTO[]
            }))
          }));
          savedProject.stages = stages as any;
          savedProject.markModified('stages');
          await savedProject.save();
        }
      } else {
        // אם לא אותחל, רק יוצר שלבים ריקים ללא אבני דרך
        const templatesResponse = await stageTemplateService.getAllStageTemplates();
        if (templatesResponse.isSuccess && templatesResponse.data) {
          const stages = templatesResponse.data.map(template => ({
            stageNumber: template.stageNumber,
            stageName: template.hebName,
            milestones: [] as any[]
          }));
          savedProject.stages = stages as any;
          savedProject.markModified('stages');
          await savedProject.save();
        }
      }
      
      const data = await this.mapToDTO(savedProject);
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
      const data = await this.mapToDTO(updatedProject);
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
      const data = await this.mapToDTO(deletedProject);
      return { isSuccess: true, data };
    } catch (error: any) {
      return { isSuccess: false, errorText: `Error deleting project: ${error.message}` };
    }
  }

  async updateMilestone(
    projectId: string, 
    stageNumber: number, 
    milestoneId: number, 
    milestoneData: Partial<MilestoneDTO>
  ): Promise<ProjectResponseDTO> {
    try {
      await connectToDatabase();
 
      // מוצא את הפרויקט
      const project = await Project.findOne({ id: projectId });
      if (!project) {
        return { isSuccess: false, errorText: 'Project not found' };
      }

      // מוצא את ה-stage
      const stage = project.stages.find(s => s.stageNumber === stageNumber);
      if (!stage) {
        return { isSuccess: false, errorText: `Stage ${stageNumber} not found` };
      }
      
      // מוצא את ה-milestone
      const milestone = stage.milestones.find(m => m.milestoneId === milestoneId);
      if (!milestone) {
        return { isSuccess: false, errorText: `Milestone ${milestoneId} not found in stage ${stageNumber}` };
      }

      // מעדכן את ה-milestone
      if (milestoneData.name !== undefined) {
        milestone.name = milestoneData.name;
      }
      if (milestoneData.documentReference !== undefined) {
        milestone.documentReference = milestoneData.documentReference;
      }
      if (milestoneData.date !== undefined) {
        milestone.date = milestoneData.date;
      }
      if (milestoneData.statusNumber !== undefined) {
        milestone.statusNumber = milestoneData.statusNumber;
      }
      if (milestoneData.isUrgent !== undefined) {
        milestone.isUrgent = milestoneData.isUrgent;
      }
      if (milestoneData.sort !== undefined) {
        milestone.sort = milestoneData.sort;
      }
      if (milestoneData.suppliers !== undefined) {
        milestone.suppliers = milestoneData.suppliers.map(s => ({
          supplierId: s.supplierId,
          supplierName: s.supplierName,
          amount: s.amount,
          isPaid: s.isPaid ?? false
        }));
      }

      // מסמן את ה-stages כ-modified
      project.markModified('stages');

      // שומר את הפרויקט עם העדכון
      await project.save();
      
      const data = await this.mapToDTO(project);
      return { isSuccess: true, data };
    } catch (error: any) {
      return { isSuccess: false, errorText: `Error updating milestone: ${error.message}` };
    }
  }

  async deleteMilestone(
    projectId: string, 
    stageNumber: number, 
    milestoneId: number
  ): Promise<ProjectResponseDTO> {
    try {
      await connectToDatabase();
 
      // מוצא את הפרויקט
      const project = await Project.findOne({ id: projectId });
      if (!project) {
        return { isSuccess: false, errorText: 'Project not found' };
      }

      // מוצא את ה-stage
      const stage = project.stages.find(s => s.stageNumber === stageNumber);
      if (!stage) {
        return { isSuccess: false, errorText: `Stage ${stageNumber} not found` };
      }
      
      // מוצא את האינדקס של ה-milestone
      const milestoneIndex = stage.milestones.findIndex(m => m.milestoneId === milestoneId);
      if (milestoneIndex === -1) {
        return { isSuccess: false, errorText: `Milestone ${milestoneId} not found in stage ${stageNumber}` };
      }

      // מוחק את ה-milestone
      stage.milestones.splice(milestoneIndex, 1);

      // מסמן את ה-stages כ-modified
      project.markModified('stages');

      // שומר את הפרויקט עם העדכון
      await project.save();
      
      const data = await this.mapToDTO(project);
      return { isSuccess: true, data };
    } catch (error: any) {
      return { isSuccess: false, errorText: `Error deleting milestone: ${error.message}` };
    }
  }

  async createMilestone(
    projectId: string, 
    stageNumber: number, 
    milestoneData: Partial<MilestoneDTO>
  ): Promise<ProjectResponseDTO> {
    try {
      await connectToDatabase();
 
      // מוצא את הפרויקט
      const project = await Project.findOne({ id: projectId });
      if (!project) {
        return { isSuccess: false, errorText: 'Project not found' };
      }

      // מוצא את ה-stage
      const stage = project.stages.find(s => s.stageNumber === stageNumber);
      if (!stage) {
        return { isSuccess: false, errorText: `Stage ${stageNumber} not found` };
      }

      // יוצר counter חדש ל-milestoneId
      const Counter = (await import('../models/counter.model')).Counter;
      const counter = await Counter.findByIdAndUpdate(
        'milestoneNumber',
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
      );

      const newMilestoneId = counter!.seq;

      // מחשב sort - תמיד בסוף
      const maxSort = stage.milestones.length > 0 
        ? Math.max(...stage.milestones.map(m => m.sort || 0))
        : -1;

      // יוצר אבן דרך חדשה
      const newMilestone = {
        id: `${projectId}-${stageNumber}-${newMilestoneId}`,
        milestoneId: newMilestoneId,
        name: milestoneData.name || 'אבן דרך חדשה',
        documentReference: milestoneData.documentReference || '',
        date: milestoneData.date,
        statusNumber: milestoneData.statusNumber || 1,
        isUrgent: milestoneData.isUrgent || false,
        sort: maxSort + 1,
        suppliers: milestoneData.suppliers || []
      };

      // מוסיף את אבן הדרך למערך
      stage.milestones.push(newMilestone as any);

      // מסמן את ה-stages כ-modified
      project.markModified('stages');

      // שומר את הפרויקט עם העדכון
      await project.save();
      
      const data = await this.mapToDTO(project);
      return { isSuccess: true, data };
    } catch (error: any) {
      return { isSuccess: false, errorText: `Error creating milestone: ${error.message}` };
    }
  }

  private async mapToDTO(project: IProject): Promise<ProjectDTO> {
    // Find current stage name from stages array
    const currentStage = project.stages.find(s => s.stageNumber === project.currentStageNumber);
    
    // Get customer data from populated field
    let customerName: string | undefined;
    let customerId: number | undefined;
    
    // Check if customerId was populated with customer object
    const customerIdValue = project.customerId;
    if (customerIdValue != null) {
      if (typeof customerIdValue === 'object') {
        // customerId was populated, it's now a customer object
        const customer = customerIdValue as any;
        if ('customerId' in customer) {
          customerId = customer.customerId;
          customerName = customer.name;
        }
      } else {
        // customerId is still just a number (not populated)
        customerId = typeof customerIdValue === 'string' ? parseInt(customerIdValue) : customerIdValue;
      }
    }
    
    // Get all milestone statuses for mapping
    const statusesResponse = await milestoneStatusService.getAllMilestoneStatuses();
    const statuses = statusesResponse.isSuccess ? statusesResponse.data : [];
    const statusMap = new Map(statuses.map(s => [s.milestoneStatusNumber, s.hebName]));
    
    return {
      _id: project._id?.toString(),
      id: project.id,
      projectNumber: project.projectNumber,
      customerId: customerId,
      customerName: customerName,
      projectName: project.projectName,
      statusNumber: project.statusNumber,
      currentStage: currentStage?.stageName,
      currentStageNumber: project.currentStageNumber,
      stages: project.stages.map(stage => ({
        stageNumber: stage.stageNumber,
        stageName: stage.stageName,
        name: stage.stageName, // Adding name field
        milestones: stage.milestones
          .sort((a, b) => (a.sort || 0) - (b.sort || 0))
          .map(milestone => ({
            id: milestone.id,
            milestoneId: milestone.milestoneId,
            name: milestone.name,
            documentReference: milestone.documentReference,
            date: milestone.date,
            statusNumber: milestone.statusNumber,
            status: statusMap.get(milestone.statusNumber),
            isUrgent: milestone.isUrgent || false,
            sort: milestone.sort || 0,
            suppliers: milestone.suppliers.map(supplier => ({
              supplierId: supplier.supplierId,
              supplierName: supplier.supplierName,
              amount: supplier.amount,
              isPaid: supplier.isPaid
            }))
          }))
      })),
      currentMilestoneId: project.currentMilestoneId,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt
    };
  }

  /**
   * מאחד את הפרויקט עם stage-templates כך שתמיד יוצגו כל השלבים ואבני הדרך
   */
  private async enrichProjectWithTemplates(project: ProjectDTO): Promise<ProjectDTO> {
    try {
      // מביא את כל ה-stage templates
      const templatesResponse = await stageTemplateService.getAllStageTemplates();
      if (!templatesResponse.isSuccess || !templatesResponse.data) {
        return project; // אם יש בעיה, מחזיר את הפרויקט כמו שהוא
      }

      const templates = templatesResponse.data;
      const enrichedStages: StageDTO[] = [];

      // עובר על כל template ומוסיף/משלב עם השלב הקיים
      for (const template of templates) {
        // מחפש אם השלב הזה כבר קיים בפרויקט
        const existingStage = project.stages.find(s => s.stageNumber === template.stageNumber);

        if (existingStage) {
          // אם השלב קיים, נוודא שיש את כל המילסטונים מה-template
          const enrichedMilestones: MilestoneDTO[] = [];
          
          for (const milestoneTemplate of template.milestones) {
            // מחפש אם המילסטון כבר קיים
            const existingMilestone = existingStage.milestones.find(m => m.name === milestoneTemplate.name);
            
            if (existingMilestone) {
              // אם קיים, שומר אותו עם כל הנתונים
              enrichedMilestones.push(existingMilestone);
            } else {
              // אם לא קיים, יוצר מילסטון חדש עם ערכי ברירת מחדל
              enrichedMilestones.push({
                id: `${project.id}-${template.stageNumber}-${milestoneTemplate.id}`,
                milestoneId: milestoneTemplate.id,
                name: milestoneTemplate.name,
                documentReference: '',
                statusNumber: 1,
                isUrgent: false,
                sort: milestoneTemplate.id,
                suppliers: [] as MilestoneSupplierDTO[]
              });
            }
          }
          
          enrichedStages.push({
            stageNumber: existingStage.stageNumber,
            stageName: existingStage.stageName,
            name: template.hebName,
            milestones: enrichedMilestones.sort((a, b) => (a.sort || 0) - (b.sort || 0))
          });
        } else {
          // אם השלב לא קיים, יוצר אותו חדש מה-template
          const newMilestones: MilestoneDTO[] = template.milestones.map(milestoneTemplate => ({
            id: `${project.id}-${template.stageNumber}-${milestoneTemplate.id}`,
            milestoneId: milestoneTemplate.id,
            name: milestoneTemplate.name,
            documentReference: '',
            statusNumber: 1,
            isUrgent: false,
            sort: milestoneTemplate.id,
            suppliers: [] as MilestoneSupplierDTO[]
          }));

          enrichedStages.push({
            stageNumber: template.stageNumber,
            stageName: template.hebName,
            name: template.hebName,
            milestones: newMilestones.sort((a, b) => (a.sort || 0) - (b.sort || 0))
          });
        }
      }

      // עדכן את currentStage על סמך currentStageNumber
      const currentStageFromEnriched = enrichedStages.find(s => s.stageNumber === project.currentStageNumber);
      
      // מחזיר את הפרויקט עם השלבים המועשרים
      return {
        ...project,
        currentStage: currentStageFromEnriched?.stageName || project.currentStage,
        stages: enrichedStages
      };
    } catch (error) {
      console.error('Error enriching project with templates:', error);
      return project; // במקרה של שגיאה, מחזיר את הפרויקט המקורי
    }
  }
}

export const projectsService = new ProjectsService();
