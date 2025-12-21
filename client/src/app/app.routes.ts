import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { 
    path: 'dashboard', 
    loadComponent: () => import('./components/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  { 
    path: 'leads', 
    loadComponent: () => import('./components/leads/leads-list/leads-list.component').then(m => m.LeadsListComponent)
  },
  { 
    path: 'suppliers', 
    loadComponent: () => import('./components/suppliers/suppliers-list/suppliers-list.component').then(m => m.SuppliersListComponent)
  },
  { 
    path: 'customers', 
    loadComponent: () => import('./components/customers/customers-list/customers-list.component').then(m => m.CustomersListComponent)
  },
  { 
    path: 'projects', 
    loadComponent: () => import('./components/projects/projects-list/projects-list.component').then(m => m.ProjectsListComponent)
  },
  { 
    path: 'projects/:id', 
    loadComponent: () => import('./components/projects/project-detail/project-detail.component').then(m => m.ProjectDetailComponent)
  }
];
