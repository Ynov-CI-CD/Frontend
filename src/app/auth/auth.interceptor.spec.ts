import {TestBed} from '@angular/core/testing';
import {HttpErrorResponse, HttpHandlerFn, HttpRequest, HttpResponse} from '@angular/common/http';
import {Router} from '@angular/router';
import {TokenService} from './token.service';
import {AuthService} from './auth.service';
import {authInterceptor} from './auth.interceptor';
import {BehaviorSubject, of, throwError} from 'rxjs';
import {JwtTokenPayload} from '../models/jwt-token-payload.model';
import {jwtDecode} from 'jwt-decode';

describe('authInterceptor', () => {
  let router: jasmine.SpyObj<Router>;
  let tokenService: jasmine.SpyObj<TokenService>;
  let authService: {
    isLoggedIn$: BehaviorSubject<boolean>;
    loggedUser$: BehaviorSubject<JwtTokenPayload | undefined>;
  };
  let request: HttpRequest<unknown>;
  let next: jasmine.Spy<HttpHandlerFn>;

  beforeEach(() => {
    router = jasmine.createSpyObj('Router', ['navigate']);
    tokenService = jasmine.createSpyObj('TokenService', ['getToken', 'isLoggedIn', 'clearTokens']);
    authService = {
      isLoggedIn$: new BehaviorSubject<boolean>(false),
      loggedUser$: new BehaviorSubject<JwtTokenPayload | undefined>(undefined)
    };
    next = jasmine.createSpy('HttpHandlerFn');

    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: router },
        { provide: TokenService, useValue: tokenService },
        { provide: AuthService, useValue: authService }
      ]
    });

    request = new HttpRequest('GET', '/api/test');
  });

  it('should add auth token to headers when token exists', (done) => {
    // Use a valid JWT format: header.payload.signature
    const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyMTIzIiwiZXhwIjoxMjM0NTY3ODksImVtYWlsIjoidXNlckBleGFtcGxlLmNvbSIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxMjM0NTY3ODB9.signature';

    const mockDecodedToken: JwtTokenPayload = {
      sub: 'user123',
      exp: 123456789,
      email: 'user@example.com',
      role: 'user',
      iat: 123456780
    };
    const mockResponse = new HttpResponse({
      body: {},
      status: 200,
      statusText: 'OK'
    });

    tokenService.getToken.and.returnValue(mockToken);
    tokenService.isLoggedIn.and.returnValue(true);
    next.and.returnValue(of(mockResponse));

    const jwtDecodeSpy = spyOn(require('jwt-decode'), 'jwtDecode');
    jwtDecodeSpy.and.returnValue(mockDecodedToken);

    TestBed.runInInjectionContext(() => {
      authInterceptor(request, next).subscribe({
        next: () => {
          const modifiedRequest = next.calls.first().args[0] as HttpRequest<unknown>;
          expect(modifiedRequest.headers.get('Authorization')).toBe(`Bearer ${mockToken}`);
          expect(authService.isLoggedIn$.value).toBeTrue();
          expect(authService.loggedUser$.value).toEqual(mockDecodedToken);
          done();
        }
      });
    });
  });

  it('should not modify headers when no token exists', (done) => {
    const mockResponse = new HttpResponse({
      body: {},
      status: 200,
      statusText: 'OK'
    });

    tokenService.getToken.and.returnValue(null);
    next.and.returnValue(of(mockResponse));

    TestBed.runInInjectionContext(() => {
      authInterceptor(request, next).subscribe({
        next: () => {
          const modifiedRequest = next.calls.first().args[0] as HttpRequest<unknown>;
          expect(modifiedRequest.headers.get('Authorization')).toBeNull();
          done();
        }
      });
    });
  });

  it('should handle 401 error and clear auth state', (done) => {
    const mockToken = 'test-token';
    const error = new HttpErrorResponse({
      status: 401,
      statusText: 'Unauthorized'
    });

    tokenService.getToken.and.returnValue(mockToken);
    next.and.returnValue(throwError(() => error));

    TestBed.runInInjectionContext(() => {
      authInterceptor(request, next).subscribe({
        error: (err) => {
          expect(router.navigate).toHaveBeenCalledWith(['login']);
          expect(tokenService.clearTokens).toHaveBeenCalled();
          expect(authService.isLoggedIn$.value).toBeFalse();
          expect(authService.loggedUser$.value).toBeUndefined();
          expect(err).toBe(error);
          done();
        }
      });
    });
  });

  it('should pass through non-401 errors', (done) => {
    const mockToken = 'test-token';
    const error = new HttpErrorResponse({
      status: 500,
      statusText: 'Internal Server Error'
    });

    tokenService.getToken.and.returnValue(mockToken);
    next.and.returnValue(throwError(() => error));

    TestBed.runInInjectionContext(() => {
      authInterceptor(request, next).subscribe({
        error: (err) => {
          // Assert
          expect(router.navigate).not.toHaveBeenCalled();
          expect(tokenService.clearTokens).not.toHaveBeenCalled();
          expect(err).toBe(error);
          done();
        }
      });
    });
  });

  it('should not update authService state when token exists but user is not logged in', (done) => {
    // Arrange
    const mockToken = 'valid-token';
    const mockResponse = new HttpResponse({
      body: {},
      status: 200,
      statusText: 'OK'
    });

    tokenService.getToken.and.returnValue(mockToken);
    tokenService.isLoggedIn.and.returnValue(false);
    next.and.returnValue(of(mockResponse));

    const jwtDecodeSpy = spyOn(require('jwt-decode'), 'jwtDecode');

    TestBed.runInInjectionContext(() => {
      authInterceptor(request, next).subscribe({
        next: () => {
          // Assert
          expect(authService.isLoggedIn$.value).toBeFalse();
          expect(authService.loggedUser$.value).toBeUndefined();
          expect(jwtDecodeSpy).not.toHaveBeenCalled();
          done();
        }
      });
    });
  });
});

declare global {
  interface Window {
    jwtDecode: typeof jwtDecode;
  }
}
