import {TestBed} from '@angular/core/testing';
import {ActivatedRouteSnapshot, Router, RouterStateSnapshot} from '@angular/router';
import {authGuard} from './auth.guard';
import {AuthService} from './auth.service';

describe('authGuard', () => {
  let router: jasmine.SpyObj<Router>;
  let authService: jasmine.SpyObj<AuthService>;

  beforeEach(() => {
    // Create spy objects for Router and AuthService
    router = jasmine.createSpyObj('Router', ['navigate']);
    authService = jasmine.createSpyObj('AuthService', ['hasValidToken']);

    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: router },
        { provide: AuthService, useValue: authService }
      ]
    });
  });

  it('should allow access when user has valid token', () => {
    // Arrange
    authService.hasValidToken.and.returnValue(true);
    const route = {} as ActivatedRouteSnapshot;
    const state = { url: '/protected' } as RouterStateSnapshot;

    // Act
    const result = TestBed.runInInjectionContext(() => authGuard(route, state));

    // Assert
    expect(result).toBe(true);
    expect(authService.hasValidToken).toHaveBeenCalled();
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('should redirect to login when user has no valid token', () => {
    // Arrange
    authService.hasValidToken.and.returnValue(false);
    router.navigate.and.returnValue(Promise.resolve(true));
    const route = {} as ActivatedRouteSnapshot;
    const state = { url: '/protected' } as RouterStateSnapshot;

    // Act
    const result = TestBed.runInInjectionContext(() => authGuard(route, state));

    // Assert
    expect(result).toBe(false);
    expect(authService.hasValidToken).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(
      ['/login'],
      {
        queryParams: {
          returnUrl: '/protected'
        }
      }
    );
  });
});
