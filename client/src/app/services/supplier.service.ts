import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Supplier } from '../models/supplier.model';

@Injectable({
  providedIn: 'root'
})
export class SupplierService {
  private storageKey = 'suppliers';

  getAll(): Observable<Supplier[]> {
    const data = localStorage.getItem(this.storageKey);
    const suppliers = data ? JSON.parse(data) : [];
    return of(suppliers);
  }

  getById(id: string): Observable<Supplier | undefined> {
    const data = localStorage.getItem(this.storageKey);
    const suppliers: Supplier[] = data ? JSON.parse(data) : [];
    return of(suppliers.find(supplier => supplier.id === id));
  }

  create(supplier: Omit<Supplier, 'id' | 'createdAt' | 'updatedAt'>): Observable<Supplier> {
    const newSupplier: Supplier = {
      ...supplier,
      id: this.generateId(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const data = localStorage.getItem(this.storageKey);
    const suppliers: Supplier[] = data ? JSON.parse(data) : [];
    suppliers.push(newSupplier);
    localStorage.setItem(this.storageKey, JSON.stringify(suppliers));
    return of(newSupplier);
  }

  update(id: string, updates: Partial<Supplier>): Observable<Supplier> {
    const data = localStorage.getItem(this.storageKey);
    const suppliers: Supplier[] = data ? JSON.parse(data) : [];
    const index = suppliers.findIndex(supplier => supplier.id === id);
    
    if (index !== -1) {
      suppliers[index] = {
        ...suppliers[index],
        ...updates,
        updatedAt: new Date()
      };
      localStorage.setItem(this.storageKey, JSON.stringify(suppliers));
      return of(suppliers[index]);
    }
    
    return of(updates as Supplier);
  }

  delete(id: string): Observable<void> {
    const data = localStorage.getItem(this.storageKey);
    const suppliers: Supplier[] = data ? JSON.parse(data) : [];
    const filtered = suppliers.filter(supplier => supplier.id !== id);
    localStorage.setItem(this.storageKey, JSON.stringify(filtered));
    return of(undefined);
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}
