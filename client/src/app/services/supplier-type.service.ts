import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SupplierType } from '../models/supplier-type.model';
import { BaseDataResponse } from '../models/base-response.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SupplierTypeService {
  private apiUrl = `${environment.API_BASE_URL}/api/supplier-types`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<BaseDataResponse<SupplierType[]>> {
    return this.http.get<BaseDataResponse<SupplierType[]>>(this.apiUrl);
  }

  getActive(): Observable<BaseDataResponse<SupplierType[]>> {
    return this.http.get<BaseDataResponse<SupplierType[]>>(`${this.apiUrl}?activeOnly=true`);
  }

  getById(id: string): Observable<BaseDataResponse<SupplierType>> {
    return this.http.get<BaseDataResponse<SupplierType>>(`${this.apiUrl}/${id}`);
  }

  create(supplierType: Partial<SupplierType>): Observable<BaseDataResponse<SupplierType>> {
    return this.http.post<BaseDataResponse<SupplierType>>(this.apiUrl, supplierType);
  }

  update(id: string, supplierType: Partial<SupplierType>): Observable<BaseDataResponse<SupplierType>> {
    return this.http.put<BaseDataResponse<SupplierType>>(`${this.apiUrl}/${id}`, supplierType);
  }

  delete(id: string): Observable<BaseDataResponse<any>> {
    return this.http.delete<BaseDataResponse<any>>(`${this.apiUrl}/${id}`);
  }
}
