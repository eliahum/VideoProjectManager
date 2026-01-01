import apiClient from './apiClient';
import type { Supplier, SupplierResponse, SuppliersListResponse } from '../types/supplier.model';

class SuppliersService {
  private readonly API_URL = '/api/suppliers';

  async getAll(): Promise<SuppliersListResponse> {
    const response = await apiClient.get<SuppliersListResponse>(this.API_URL);
    return response.data;
  }

  async getById(id: string): Promise<SupplierResponse> {
    const response = await apiClient.get<SupplierResponse>(`${this.API_URL}/${id}`);
    return response.data;
  }

  async create(supplier: Partial<Supplier>): Promise<SupplierResponse> {
    const response = await apiClient.post<SupplierResponse>(this.API_URL, supplier);
    return response.data;
  }

  async update(id: string, supplier: Partial<Supplier>): Promise<SupplierResponse> {
    const response = await apiClient.put<SupplierResponse>(`${this.API_URL}/${id}`, supplier);
    return response.data;
  }

  async delete(id: string): Promise<void> {
    await apiClient.delete(`${this.API_URL}/${id}`);
  }
}

export default new SuppliersService();
