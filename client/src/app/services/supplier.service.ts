import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Supplier, SupplierResponse, SuppliersListResponse } from '../models/supplier.model';
import { API_BASE_URL } from '../../environments/api.config';

@Injectable({
  providedIn: 'root'
})
export class SupplierService {
  private apiUrl = `${API_BASE_URL}/api/suppliers`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<SuppliersListResponse> {
    return this.http.get<SuppliersListResponse>(this.apiUrl);
  }

  getById(id: string): Observable<SupplierResponse> {
    return this.http.get<SupplierResponse>(`${this.apiUrl}/${id}`);
  }

  create(supplier: Partial<Supplier>): Observable<SupplierResponse> {
    return this.http.post<SupplierResponse>(this.apiUrl, supplier);
  }

  update(id: string, updates: Partial<Supplier>): Observable<SupplierResponse> {
    return this.http.put<SupplierResponse>(`${this.apiUrl}/${id}`, updates);
  }

  delete(id: string): Observable<SupplierResponse> {
    return this.http.delete<SupplierResponse>(`${this.apiUrl}/${id}`);
  }
}

