import apiClient from './apiClient';
import type { Project, ProjectResponse, ProjectListResponse } from '../types/project.model';

class ProjectsService {
  private readonly API_URL = '/api/projects';

  async getAll(): Promise<ProjectListResponse> {
    const response = await apiClient.get<ProjectListResponse>(this.API_URL);
    return response.data;
  }

  async getById(id: string): Promise<ProjectResponse> {
    const response = await apiClient.get<ProjectResponse>(`${this.API_URL}/${id}`);
    return response.data;
  }

  async create(project: Partial<Project>): Promise<ProjectResponse> {
    const response = await apiClient.post<ProjectResponse>(this.API_URL, project);
    return response.data;
  }

  async update(id: string, project: Partial<Project>): Promise<ProjectResponse> {
    const response = await apiClient.put<ProjectResponse>(`${this.API_URL}/${id}`, project);
    return response.data;
  }

  async delete(id: string): Promise<void> {
    await apiClient.delete(`${this.API_URL}/${id}`);
  }
}

export default new ProjectsService();
