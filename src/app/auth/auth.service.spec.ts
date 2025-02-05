import {TestBed} from '@angular/core/testing';
import {AuthService} from './auth.service';
import {HttpTestingController, provideHttpClientTesting} from '@angular/common/http/testing';
import {TokenService} from './token.service';
import {Router} from '@angular/router';
import {JwtTokenPayload} from '../models/jwt-token-payload.model';
import {CreateUserDto} from '../models/user.dto';
import {environment} from '../../environments/environment';
import {provideHttpClient} from '@angular/common/http';
import {LoginDto} from '../models/login.dto';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let tokenServiceSpy: jasmine.SpyObj<TokenService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let jwtDecodeSpy: jasmine.Spy;

  const mockToken = 'valid-jwt-token';
  const mockJwtPayload: JwtTokenPayload = {
    sub: 'user123',
    email: 'user@example.com',
    role: 'user',
    exp: Math.floor(Date.now() / 1000) + 3600, // 1 hour expiry
    iat: Math.floor(Date.now() / 1000),
  };

  beforeEach(() => {
    const tokenService = jasmine.createSpyObj('TokenService', ['setToken', 'clearTokens', 'getToken']);
    const router = jasmine.createSpyObj('Router', ['navigate']);
    jwtDecodeSpy = spyOn(require('jwt-decode'), 'jwtDecode');

    TestBed.configureTestingModule({
      imports: [],
      providers: [
        AuthService,
        { provide: TokenService, useValue: tokenService },
        { provide: Router, useValue: router },
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    tokenServiceSpy = TestBed.inject(TokenService) as jasmine.SpyObj<TokenService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('signIn', () => {
    it('should call the login API and handle the token response', (done) => {
      const loginDto: LoginDto = { email: 'user@example.com', password: 'password123' };
      const mockResponse = { access_token: mockToken };

      jwtDecodeSpy.and.returnValue(mockJwtPayload);

      service.signIn(loginDto).subscribe({
        next: () => {
          expect(tokenServiceSpy.setToken).toHaveBeenCalledWith(mockToken);
          expect(service.isLoggedIn$.value).toBeTrue();
          expect(service.loggedUser$.value).toEqual(mockJwtPayload);
          done();
        },
        error: () => {
          done();
        }
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/auth/login`);
      expect(req.request.method).toBe('POST');
      req.flush(mockResponse);
    });

    it('should handle an error during login', (done) => {
      const loginDto = { email: 'user@example.com', password: 'password123' };
      const mockError = { status: 401, statusText: 'Unauthorized' };

      service.signIn(loginDto).subscribe({
        error: (error) => {
          expect(error.message).toBe('Authentication failed. Please try again.');
          done();
        },
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/auth/login`);
      expect(req.request.method).toBe('POST');
      req.flush({}, mockError);
    });
  });

  describe('signOn', () => {
    it('should call the register API and handle the token response', (done) => {
      const createUserDto: CreateUserDto = {
        email: 'newuser@example.com',
        password: 'password123',
        repeatPassword: 'password123',
        firstName: 'New',
        lastName: 'User',
        birthDate: new Date('1990-01-01'),
        city: 'CityA',
        zipCode: '12345'
      };
      const mockResponse = { access_token: mockToken };

      jwtDecodeSpy.and.returnValue(mockJwtPayload);

      service.signOn(createUserDto).subscribe({
        next: () => {
          expect(tokenServiceSpy.setToken).toHaveBeenCalledWith(mockToken);
          expect(service.isLoggedIn$.value).toBeTrue();
          expect(service.loggedUser$.value).toEqual(mockJwtPayload);
          done();
        },
        error: () => {
          done();
        }
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/auth/register`);
      expect(req.request.method).toBe('POST');
      req.flush(mockResponse);
    });

    it('should handle an error during registration', (done) => {
      const createUserDto: CreateUserDto = { email: 'newuser@example.com', password: 'password123', repeatPassword: 'password123', firstName: 'New', lastName: 'User', birthDate: new Date('1990-01-01'), city: 'CityA', zipCode: '12345' };
      const mockError = { status: 400, statusText: 'Bad Request' };

      service.signOn(createUserDto).subscribe({
        error: (error) => {
          expect(error.message).toBe('Authentication failed. Please try again.');
          done();
        },
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/auth/register`);
      expect(req.request.method).toBe('POST');
      req.flush({}, mockError);
    });
  });

  describe('handleLogout', () => {
    it('should clear tokens, reset state, and navigate to login', () => {
      service.handleLogout();

      expect(tokenServiceSpy.clearTokens).toHaveBeenCalled();
      expect(service.isLoggedIn$.value).toBeFalse();
      expect(service.loggedUser$.value).toBeUndefined();
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
    });
  });

  describe('isUserAdmin', () => {
    it('should return true if the logged user is an admin', () => {
      service.loggedUser$.next({ ...mockJwtPayload, role: 'admin' });

      expect(service.isUserAdmin()).toBeTrue();
    });

    it('should return false if the logged user is not an admin', () => {
      service.loggedUser$.next(mockJwtPayload);

      expect(service.isUserAdmin()).toBeFalse();
    });

    it('should return false if no user is logged in', () => {
      service.loggedUser$.next(undefined);

      expect(service.isUserAdmin()).toBeFalse();
    });
  });

  describe('hasValidToken', () => {
    it('should return true if a token exists', () => {
      localStorage.setItem('access_token', mockToken);

      expect(service.hasValidToken()).toBeTrue();

      localStorage.removeItem('access_token');
    });

    it('should return false if no token exists', () => {
      localStorage.removeItem('access_token');

      expect(service.hasValidToken()).toBeFalse();
    });
  });
});
