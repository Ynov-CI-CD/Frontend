import {HttpErrorResponse, HttpEvent, HttpInterceptorFn} from '@angular/common/http';
import {catchError, tap} from 'rxjs';
import {jwtDecode} from 'jwt-decode';
import {JwtTokenPayload} from '../models/jwt-token-payload.model';
import {throwError} from 'rxjs';
import {inject} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from './auth.service';
import {TokenService} from './token.service';


export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenService = inject(TokenService);
  const authService = inject(AuthService);
  const router = inject(Router);

  const authToken = tokenService.getToken();

  if (authToken) {
    req = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${authToken}`)
    });
  }

  return next(req).pipe(
    tap((response: HttpEvent<any>) => {
      if(tokenService.isLoggedIn() && authToken) {
        authService.isLoggedIn$.next(true);
        authService.loggedUser$.next(jwtDecode<JwtTokenPayload>(authToken));
      }
    }),
    catchError((error) => {
      if (error instanceof HttpErrorResponse && error.status === 401) {
        router.navigate(['login']);
        tokenService.clearTokens();
        authService.isLoggedIn$.next(false);
        authService.loggedUser$.next(undefined);
      }
      return throwError(() => error);
    })
  );
};

