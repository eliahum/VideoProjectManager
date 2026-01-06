import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Customer, CustomerResponse, CustomersListResponse } from '../models/customer.model';
import { API_BASE_URL } from '../../environments/api.config';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private apiUrl = `${API_BASE_URL}/api/customers`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<CustomersListResponse> {
    return this.http.get<CustomersListResponse>(this.apiUrl);
  }

  getById(id: string): Observable<CustomerResponse> {
    return this.http.get<CustomerResponse>(`${this.apiUrl}/${id}`);
  }

  create(customer:  Partial<Customer>): Observable<CustomerResponse> {
    return this.http.post<CustomerResponse>(this.apiUrl, customer);
  }

  update(id: string, updates: Partial<Customer>): Observable<CustomerResponse> {
    return this.http.put<CustomerResponse>(`${this.apiUrl}/${id}`, updates);
  }

  delete(id: string): Observable<CustomerResponse> {
    return this.http.delete<CustomerResponse>(`${this.apiUrl}/${id}`);
  }

  getCustomerContacts(customerId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${customerId}/contacts`);
  }

  getCustomerContactsByNumber(customerNumber: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/number/${customerNumber}/contacts`);
  }

  // No need for generateId, handled by backend
}
