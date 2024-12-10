import {CanActivateFn, Router} from '@angular/router';
import {inject} from '@angular/core';
import {AuthService} from './auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Check if the user has a valid token
  if (authService.hasValidToken()) {
    return true; // Allow access to the route
  }

  // If no valid token, redirect to login page
  router.navigate(['/login'], {
    queryParams: {
      returnUrl: state.url // Optional: pass the attempted URL for redirect after login
    }
  }).then();

  return false; // Prevent access to the route
};
