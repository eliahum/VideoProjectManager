import apiClient from './apiClient';
import type { ProjectStatus, ProjectStatusListResponse, MilestoneStatus, MilestoneStatusListResponse } from '../types/project.model';

class ProjectStatusService {
  private readonly API_URL = '/api/project-statuses';

  async getAll(): Promise<ProjectStatusListResponse> {
    const response = await apiClient.get<ProjectStatusListResponse>(this.API_URL);
    return response.data;
  }

  async create(status: Partial<ProjectStatus>): Promise<any> {
    const response = await apiClient.post(this.API_URL, status);
    return response.data;
  }

  async update(id: string, status: Partial<ProjectStatus>): Promise<any> {
    const response = await apiClient.put(`${this.API_URL}/${id}`, status);
    return response.data;
  }

  async delete(id: string): Promise<void> {
    await apiClient.delete(`${this.API_URL}/${id}`);
  }
}

class MilestoneStatusService {
  private readonly API_URL = '/api/milestone-statuses';

  async getAll(): Promise<MilestoneStatusListResponse> {
    const response = await apiClient.get<MilestoneStatusListResponse>(this.API_URL);
    return response.data;
  }

  async create(status: Partial<MilestoneStatus>): Promise<any> {
    const response = await apiClient.post(this.API_URL, status);
    return response.data;
  }

  async update(id: string, status: Partial<MilestoneStatus>): Promise<any> {
    const response = await apiClient.put(`${this.API_URL}/${id}`, status);
    return response.data;
  }

  async delete(id: string): Promise<void> {
    await apiClient.delete(`${this.API_URL}/${id}`);
  }
}

export const projectStatusService = new ProjectStatusService();
export const milestoneStatusService = new MilestoneStatusService();
