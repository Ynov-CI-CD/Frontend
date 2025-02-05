import {ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';

import {LoginComponent} from './login.component';
import {provideHttpClientTesting} from '@angular/common/http/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {ReactiveFormsModule} from '@angular/forms';
import {of, throwError} from 'rxjs';
import {Router} from '@angular/router';
import {AuthService} from '../../auth/auth.service';
import {provideHttpClient} from '@angular/common/http';
import {JwtTokenPayload} from '../../models/jwt-token-payload.model';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: AuthService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginComponent, RouterTestingModule, ReactiveFormsModule],
      providers: [
        AuthService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);

    // Important: Call ngOnInit to initialize the form
    component.ngOnInit();
    fixture.detectChanges();
  });

  it('should create the login component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the login form with required fields and validation', () => {
    expect(component.loginForm).toBeTruthy();
    expect(component.loginForm.get('email')).toBeTruthy();
    expect(component.loginForm.get('password')).toBeTruthy();
  });

  it('should display email validation errors when the email is invalid', () => {
    const emailControl = component.loginForm.get('email');

    emailControl?.setValue('');
    emailControl?.markAsTouched();
    emailControl?.markAsDirty();
    component.loginForm.markAsTouched();
    fixture.detectChanges();

    let emailErrorElement = fixture.nativeElement.querySelector('div small');
    expect(emailErrorElement).toBeTruthy('Required error message should be present');
    expect(emailErrorElement.textContent.trim()).toBe('Email is required');

    emailControl?.setValue('invalid-email');
    emailControl?.markAsTouched();
    emailControl?.markAsDirty();
    fixture.detectChanges();

    emailErrorElement = fixture.nativeElement.querySelector('div small');
    expect(emailErrorElement).toBeTruthy('Invalid format error message should be present');
    expect(emailErrorElement.textContent.trim()).toBe('Invalid email format');

    emailControl?.setValue('valid@email.com');
    fixture.detectChanges();

    emailErrorElement = fixture.nativeElement.querySelector('div small');
    expect(emailErrorElement).toBeNull('No error message should be present for valid email');
  });

  it('should display password validation errors when the password is invalid', () => {
    const passwordControl = component.loginForm.get('password');

    passwordControl?.markAsTouched();
    passwordControl?.setValue('');
    fixture.detectChanges();

    const passwordErrors = fixture.nativeElement.querySelector('[formControlName="password"] + div small');
    expect(passwordErrors.textContent.trim()).toContain('Password is required');

    passwordControl?.setValue('short');
    fixture.detectChanges();
    expect(passwordErrors.textContent).toContain('Password is required');
  });


  it('should validate form before submission', fakeAsync(() => {
    component.loginForm.setValue({
      email: 'invalid-email',
      password: 'short'
    });
    fixture.detectChanges();

    component.onSubmit();
    tick();
    fixture.detectChanges();

    const authServiceSpy = spyOn(authService, 'signIn');
    expect(authServiceSpy).not.toHaveBeenCalled();
  }));

  it('should handle login form submission successfully', fakeAsync(() => {
    const loginDto = { email: 'test@example.com', password: 'password123@' };

    const mockDecodedToken: JwtTokenPayload = {
      sub: 'user123',
      exp: 123456789,
      email: 'user@example.com',
      role: 'user',
      iat: 123456780
    };

    spyOn(authService, 'signIn').and.returnValue(of(mockDecodedToken));
    spyOn(router, 'navigate');

    component.loginForm.setValue(loginDto);
    component.onSubmit();
    tick();
    fixture.detectChanges();

    expect(authService.signIn).toHaveBeenCalledWith(loginDto);
    expect(component.successMessage).toBe('Login successful!');
    expect(component.errorMessage).toBe(null);
    expect(router.navigate).toHaveBeenCalledWith(['/']);
  }));

  it('should handle login form submission with error', () => {
    const loginDto = { email: 'test@example.com', password: 'password123' };

    component.loginForm.patchValue(loginDto);
    fixture.detectChanges();

    spyOn(authService, 'signIn').and.returnValue(throwError(() => new Error('Login failed')));
    spyOn(router, 'navigate');

    component.onSubmit();
    fixture.detectChanges();

    expect(authService.signIn).toHaveBeenCalledWith(loginDto);
    expect(component.errorMessage).toBe('Login failed. Please try again.');
    expect(component.successMessage).toBeNull();
    expect(router.navigate).not.toHaveBeenCalled();

    const errorMessageElement = fixture.nativeElement.querySelector('.error-message');
    expect(errorMessageElement.textContent).toContain('Login failed. Please try again.');
  });

  it('should disable submit button when form is invalid', () => {
    component.loginForm.get('email')?.setValue('');
    component.loginForm.get('password')?.setValue('');
    fixture.detectChanges();

    const submitButton = fixture.nativeElement.querySelector('button');
    expect(submitButton.disabled).toBeTrue();
  });

  it('should enable submit button when form is valid', () => {
    component.loginForm.get('email')?.setValue('test@example.com');
    component.loginForm.get('password')?.setValue('password123');
    fixture.detectChanges();

    const submitButton = fixture.nativeElement.querySelector('button');
    expect(submitButton.disabled).toBeFalse();
  });
});
