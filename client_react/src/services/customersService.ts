import apiClient from './apiClient';
import type { Customer, CustomerResponse, CustomersListResponse } from '../types/customer.model';

class CustomersService {
  private readonly API_URL = '/api/customers';

  async getAll(): Promise<CustomersListResponse> {
    const response = await apiClient.get<CustomersListResponse>(this.API_URL);
    return response.data;
  }

  async getById(id: string): Promise<CustomerResponse> {
    const response = await apiClient.get<CustomerResponse>(`${this.API_URL}/${id}`);
    return response.data;
  }

  async create(customer: Partial<Customer>): Promise<CustomerResponse> {
    const response = await apiClient.post<CustomerResponse>(this.API_URL, customer);
    return response.data;
  }

  async update(id: string, customer: Partial<Customer>): Promise<CustomerResponse> {
    const response = await apiClient.put<CustomerResponse>(`${this.API_URL}/${id}`, customer);
    return response.data;
  }

  async delete(id: string): Promise<void> {
    await apiClient.delete(`${this.API_URL}/${id}`);
  }
}

export default new CustomersService();
