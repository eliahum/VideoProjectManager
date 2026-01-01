import apiClient from './apiClient';
import type { Lead, LeadResponse, LeadsListResponse, LeadStatus, LeadStatusListResponse } from '../types/lead.model';

class LeadsService {
  private readonly API_URL = '/api/leads';

  async getAll(): Promise<LeadsListResponse> {
    const response = await apiClient.get<LeadsListResponse>(this.API_URL);
    return response.data;
  }

  async getById(id: string): Promise<LeadResponse> {
    const response = await apiClient.get<LeadResponse>(`${this.API_URL}/${id}`);
    return response.data;
  }

  async create(lead: Partial<Lead>): Promise<LeadResponse> {
    const response = await apiClient.post<LeadResponse>(this.API_URL, lead);
    return response.data;
  }

  async update(id: string, lead: Partial<Lead>): Promise<LeadResponse> {
    const response = await apiClient.put<LeadResponse>(`${this.API_URL}/${id}`, lead);
    return response.data;
  }

  async delete(id: string): Promise<void> {
    await apiClient.delete(`${this.API_URL}/${id}`);
  }
}

class LeadStatusService {
  private readonly API_URL = '/api/lead-statuses';

  async getAll(): Promise<LeadStatusListResponse> {
    const response = await apiClient.get<LeadStatusListResponse>(this.API_URL);
    return response.data;
  }

  async create(status: Partial<LeadStatus>): Promise<LeadResponse> {
    const response = await apiClient.post<LeadResponse>(this.API_URL, status);
    return response.data;
  }

  async update(id: string, status: Partial<LeadStatus>): Promise<LeadResponse> {
    const response = await apiClient.put<LeadResponse>(`${this.API_URL}/${id}`, status);
    return response.data;
  }

  async delete(id: string): Promise<void> {
    await apiClient.delete(`${this.API_URL}/${id}`);
  }
}

export const leadsService = new LeadsService();
export const leadStatusService = new LeadStatusService();
