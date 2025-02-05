import {inject, Injectable} from '@angular/core';
import {LoginDto} from '../models/login.dto';
import {BehaviorSubject, catchError, map, Observable, tap} from 'rxjs';
import {environment} from '../../environments/environment';
import {CreateUserDto, UserDto} from '../models/user.dto';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {TokenService} from './token.service';
import {jwtDecode} from 'jwt-decode';
import {JwtTokenPayload} from '../models/jwt-token-payload.model';
import {throwError} from 'rxjs';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  authApiUrl = `${environment.apiUrl}/auth`;

  http = inject(HttpClient);
  tokenService = inject(TokenService);
  router = inject(Router);

  isLoggedIn$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  loggedUser$: BehaviorSubject<JwtTokenPayload | undefined> = new BehaviorSubject<JwtTokenPayload | undefined>(undefined);


  /**
   * Connects the user to the application
   *
   * @param {LoginDto} loginDto The data for signing in the user.
   * @returns {Observable<void>} An observable that emits the connection.
   */
  signIn(loginDto: LoginDto): Observable<JwtTokenPayload> {
    return this.http.post<UserDto>(`${this.authApiUrl}/login`, loginDto)
      .pipe(
        map(this.handleTokenResponse.bind(this)),
        catchError(this.handleError)
      );
  }

  /**
   * Creates a new user by sending a POST request to the server and updates the local data.
   *
   * @param {CreateUserDto} createUserDto The data for creating the new user.
   * @returns {Observable<UserDto>} An observable that emits the created user.
   */
  signOn(createUserDto: Omit<CreateUserDto, 'repeatPassword'>): Observable<JwtTokenPayload> {
    return this.http.post<UserDto>(`${this.authApiUrl}/register`, createUserDto).pipe(
      map(this.handleTokenResponse.bind(this)),
      catchError(this.handleError)
    );
  }

  isUserAdmin(): boolean {
    return this.loggedUser$.value?.role === 'admin';
  }


  private handleTokenResponse(response: any): JwtTokenPayload {
      const jwtDecoded = jwtDecode<JwtTokenPayload>(response.access_token)
      this.tokenService.setToken(response.access_token);
      this.isLoggedIn$.next(true);
      this.loggedUser$.next(jwtDecoded);
      return jwtDecoded;
  }

  public handleLogout(): void {
    this.router.navigate(['/login']);
    this.tokenService.clearTokens();
    this.isLoggedIn$.next(false);
    this.loggedUser$.next(undefined);
  }

  private handleError(error: HttpErrorResponse) {
    console.error('Auth error:', error);
    return throwError(() => new Error('Authentication failed. Please try again.'));
  }

  hasValidToken(): boolean {
    // Check if token exists and is not expired
    const token = localStorage.getItem('access_token');

    // You might want to add more sophisticated token validation
    return !!token; // Returns true if token exists
  }
}
