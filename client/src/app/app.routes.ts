import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { 
    path: 'login', 
    loadComponent: () => import('./components/auth/login/login.component').then(m => m.LoginComponent)
  },
  { 
    path: 'dashboard', 
    loadComponent: () => import('./components/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [authGuard]
  },
  { 
    path: 'dashboard/charts', 
    loadComponent: () => import('./components/dashboard/dashboard-charts/dashboard-charts.component').then(m => m.DashboardChartsComponent),
    canActivate: [authGuard]
  },
  { 
    path: 'dashboard/misc', 
    loadComponent: () => import('./components/dashboard/dashboard-misc/dashboard-misc.component').then(m => m.DashboardMiscComponent),
    canActivate: [authGuard]
  },
  { 
    path: 'leads', 
    loadComponent: () => import('./components/leads/leads-list/leads-list.component').then(m => m.LeadsListComponent),
    canActivate: [authGuard]
  },
  { 
    path: 'suppliers', 
    loadComponent: () => import('./components/suppliers/suppliers-list/suppliers-list.component').then(m => m.SuppliersListComponent),
    canActivate: [authGuard]
  },
  { 
    path: 'customers', 
    loadComponent: () => import('./components/customers/customers-list/customers-list.component').then(m => m.CustomersListComponent),
    canActivate: [authGuard]
  },
  { 
    path: 'projects', 
    loadComponent: () => import('./components/projects/projects-list/projects-list.component').then(m => m.ProjectsListComponent),
    canActivate: [authGuard]
  },
  { 
    path: 'projects/:id', 
    loadComponent: () => import('./components/projects/project-detail/project-detail.component').then(m => m.ProjectDetailComponent),
    canActivate: [authGuard]
  },
  { 
    path: 'statuses', 
    loadComponent: () => import('./components/shared/statuses/statuses.component').then(m => m.StatusesComponent),
    canActivate: [authGuard]
  }
];
