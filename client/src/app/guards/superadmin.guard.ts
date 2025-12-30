import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const superadminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const user = authService.getCurrentUser();

  if (authService.isAuthenticated() && user?.role === 'superadmin') {
    return true;
  }

  // Redirect to dashboard
  router.navigate(['/dashboard']);
  return false;
};
