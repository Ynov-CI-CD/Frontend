import {ComponentFixture, TestBed} from '@angular/core/testing';

import {UsersCreationFormComponent} from './users-creation-form.component';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {HttpClientTestingModule, provideHttpClientTesting} from '@angular/common/http/testing';
import {By} from '@angular/platform-browser';
import {UsersService} from '../../services/users.service';
import {of, throwError} from 'rxjs';
import {provideHttpClient, withInterceptorsFromDi} from '@angular/common/http';
import {UserDto} from '../../models/user.dto';

class MockUserService {
  createUser(userData: any) {
    return of({ success: true });
  }
}

describe('UsersCreationFormComponent', () => {
  let component: UsersCreationFormComponent;
  let fixture: ComponentFixture<UsersCreationFormComponent>;
  let userService: jasmine.SpyObj<UsersService>;
  let formBuilder: FormBuilder;

  beforeEach(async () => {
    const userServiceSpy = jasmine.createSpyObj('UsersService', ['createUser']);

    await TestBed.configureTestingModule({
      imports: [UsersCreationFormComponent, ReactiveFormsModule, HttpClientTestingModule],
      providers: [FormBuilder, { provide: UsersService, useClass: MockUserService }, provideHttpClientTesting(), provideHttpClient(withInterceptorsFromDi()),
        { provide: UsersService, useValue: userServiceSpy }
      ]
    })
      .compileComponents();


    fixture = TestBed.createComponent(UsersCreationFormComponent);
    component = fixture.componentInstance;
    userService = TestBed.inject(UsersService) as jasmine.SpyObj<UsersService>;
    fixture.detectChanges();
    formBuilder = TestBed.inject(FormBuilder);
  });

  it('should create the form with the correct default values', () => {
    expect(component.userCreationForm).toBeDefined();
    const form = component.userCreationForm;

    expect(form.get('firstName')?.value).toBe('');
    expect(form.get('lastName')?.value).toBe('');
    expect(form.get('email')?.value).toBe('');
    expect(form.get('dateOfBirth')?.value).toBe('');
    expect(form.get('city')?.value).toBe('');
    expect(form.get('postalCode')?.value).toBe('');
    expect(form.get('password')?.value).toBe('');
    expect(form.get('repeatPassword')?.value).toBe('');
  });

  it('should mark form invalid when fields are empty', () => {
    const form = component.userCreationForm;

    form.updateValueAndValidity();
    expect(form.valid).toBeFalsy();

    expect(form.get('firstName')?.valid).toBeFalsy();
    expect(form.get('lastName')?.valid).toBeFalsy();
    expect(form.get('email')?.valid).toBeFalsy();
    expect(form.get('dateOfBirth')?.valid).toBeFalsy();
    expect(form.get('city')?.valid).toBeFalsy();
    expect(form.get('postalCode')?.valid).toBeFalsy();
    expect(form.get('password')?.valid).toBeFalsy();
  });

  it('should validate firstName correctly', () => {
    const firstName = component.userCreationForm.get('firstName');

    firstName?.setValue('');
    expect(firstName?.hasError('required')).toBeTruthy();

    firstName?.setValue('John123');
    expect(firstName?.hasError('pattern')).toBeTruthy();

    firstName?.setValue('John');
    expect(firstName?.valid).toBeTruthy();
  });

  it('should validate lastName correctly', () => {
    const lastName = component.userCreationForm.get('lastName');

    lastName?.setValue('');
    expect(lastName?.hasError('required')).toBeTruthy();

    lastName?.setValue('Doe123');
    expect(lastName?.hasError('pattern')).toBeTruthy();

    lastName?.setValue('Doe');
    expect(lastName?.valid).toBeTruthy();
  });

  it('should validate email correctly', () => {
    const email = component.userCreationForm.get('email');

    email?.setValue('');
    expect(email?.hasError('required')).toBeTruthy();

    email?.setValue('invalidemail');
    expect(email?.hasError('email')).toBeTruthy();

    email?.setValue('test@example.com');
    expect(email?.valid).toBeTruthy();
  });

  it('should validate postalCode correctly', () => {
    const postalCode = component.userCreationForm.get('postalCode');

    postalCode?.setValue('');
    expect(postalCode?.hasError('required')).toBeTruthy();

    postalCode?.setValue('abcde');
    expect(postalCode?.hasError('pattern')).toBeTruthy();

    postalCode?.setValue('1234');
    expect(postalCode?.hasError('pattern')).toBeTruthy();

    postalCode?.setValue('12345');
    expect(postalCode?.valid).toBeTruthy();
  });

  it('should mark form valid when all fields are valid', () => {
    const form = component.userCreationForm;

    form.get('firstName')?.setValue('John');
    form.get('lastName')?.setValue('Doe');
    form.get('email')?.setValue('test@example.com');
    form.get('dateOfBirth')?.setValue('1990-01-01');
    form.get('city')?.setValue('New York');
    form.get('postalCode')?.setValue('12345');
    form.get('password')?.setValue('abcdabcd');
    form.get('repeatPassword')?.setValue('abcdabcd');

    expect(form.valid).toBeTruthy();
  });

  it('should create the form and display the title', () => {
    expect(component.userCreationForm).toBeDefined();
    const titleElement = fixture.debugElement.query(By.css('h1'));
    expect(titleElement.nativeElement.textContent).toContain('Account Creation');
  });

  it('should have the correct number of input fields', () => {
    const inputFields = fixture.debugElement.queryAll(By.css('input'));
    expect(inputFields.length).toBe(8);
  });

  it('should show error message when first name is empty and the input is blurred', async () => {
    const firstNameInput = fixture.debugElement.query(By.css('input#firstName'));
    firstNameInput.nativeElement.value = '';
    firstNameInput.nativeElement.dispatchEvent(new Event('blur'));
    fixture.detectChanges();

    const errorMessage = fixture.debugElement.query(By.css('small'));
    expect(errorMessage.nativeElement.textContent).toContain('First name is required');
  });

  it('should show error message for invalid email', async () => {
    const emailInput = fixture.debugElement.query(By.css('input#email'));

    emailInput.nativeElement.value = 'invalid-email';
    emailInput.nativeElement.dispatchEvent(new Event('input'));
    emailInput.nativeElement.dispatchEvent(new Event('blur'));
    fixture.detectChanges();

    fixture.whenStable().then(() => {
      const errorMessages = fixture.debugElement.queryAll(By.css('small'));
      const emailErrorMessage = errorMessages.find(el => el.nativeElement.textContent.includes('Invalid email format'));
      expect(emailErrorMessage).toBeTruthy();
    });
  });

  it('should disable the submit button if the form is invalid', () => {
    const button = fixture.debugElement.query(By.css('button[type="submit"]'));
    expect(button.nativeElement.disabled).toBe(true);
  });

  it('should enable the submit button when the form is valid', async () => {
    component.userCreationForm.get('firstName')?.setValue('John');
    component.userCreationForm.get('lastName')?.setValue('Doe');
    component.userCreationForm.get('email')?.setValue('test@example.com');
    component.userCreationForm.get('dateOfBirth')?.setValue('2000-01-01');
    component.userCreationForm.get('city')?.setValue('New York');
    component.userCreationForm.get('postalCode')?.setValue('12345');
    component.userCreationForm.get('password')?.setValue('abcdabcd');
    component.userCreationForm.get('repeatPassword')?.setValue('abcdabcd');
    fixture.detectChanges();

    const button = fixture.debugElement.query(By.css('button[type="submit"]'));
    expect(button.nativeElement.disabled).toBe(false);
  });

  it('should display success message and reset form on successful registration', async () => {
    const mockUserResponse: UserDto = {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      email: 'test@example.com',
      dateOfBirth: new Date('2000-01-01'),
      city: 'New York',
      postalCode: '12345',
      role: 'user',
    };

    userService.createUser.and.returnValue(of(mockUserResponse));

    component.userCreationForm.get('firstName')?.setValue('John');
    component.userCreationForm.get('lastName')?.setValue('Doe');
    component.userCreationForm.get('email')?.setValue('test@example.com');
    component.userCreationForm.get('dateOfBirth')?.setValue('2000-01-01');
    component.userCreationForm.get('city')?.setValue('New York');
    component.userCreationForm.get('postalCode')?.setValue('12345');
    component.userCreationForm.get('password')?.setValue('abcdabcd');
    component.userCreationForm.get('repeatPassword')?.setValue('abcdabcd');

    await component.onSubmit();
    fixture.detectChanges();

    const successMessageElement = fixture.nativeElement.querySelector('.success-message');
    expect(successMessageElement).toBeTruthy();
    expect(successMessageElement.textContent).toContain('Registration successful!');

    expect(component.userCreationForm.value).toEqual({
      firstName: null,
      lastName: null,
      email: null,
      dateOfBirth: null,
      city: null,
      postalCode: null,
      password: null,
      repeatPassword: null
    });
  });

  it('should display error message on registration failure', async () => {
    userService.createUser.and.returnValue(throwError(() => new Error('Registration failed')));

    component.userCreationForm.get('firstName')?.setValue('John');
    component.userCreationForm.get('lastName')?.setValue('Doe');
    component.userCreationForm.get('email')?.setValue('test@example.com');
    component.userCreationForm.get('dateOfBirth')?.setValue('2000-01-01');
    component.userCreationForm.get('city')?.setValue('New York');
    component.userCreationForm.get('postalCode')?.setValue('12345');
    component.userCreationForm.get('password')?.setValue('abcdabcd');
    component.userCreationForm.get('repeatPassword')?.setValue('abcdabcd');

    component.onSubmit();
    fixture.detectChanges();

    const errorMessageElement = fixture.nativeElement.querySelector('.error-message');
    expect(errorMessageElement).toBeTruthy();
    expect(errorMessageElement.textContent).toContain('Registration failed. Please try again.');
  });

  describe('ageValidator', () => {

    beforeEach(() => {
      component.ngOnInit();
    });

    it('should return null if the age is 18 or older', () => {
      const today = new Date();
      const birthDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
      component.userCreationForm.controls['dateOfBirth'].setValue(birthDate.toISOString().split('T')[0]);

      const result = component.ageValidator(component.userCreationForm.controls['dateOfBirth']);
      expect(result).toBeNull(); // 18 or older should return null
    });

    it('should return { underage: true } if the age is below 18', () => {
      const birthDate = new Date();
      birthDate.setFullYear(birthDate.getFullYear() - 10); // Set to 10 years ago
      component.userCreationForm.controls['dateOfBirth'].setValue(birthDate.toISOString().split('T')[0]);

      const result = component.ageValidator(component.userCreationForm.controls['dateOfBirth']);
      expect(result).toEqual({ underage: true });
    });

    it('should return { underage: true } if the age is just under 18', () => {
      const today = new Date();
      const birthDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate() + 1);
      component.userCreationForm.controls['dateOfBirth'].setValue(birthDate.toISOString().split('T')[0]);

      const result = component.ageValidator(component.userCreationForm.controls['dateOfBirth']);
      expect(result).toEqual({ underage: true }); // Under 18 should return { underage: true }
    });

    it('should return { underage: true } if the user is born today', () => {
      const today = new Date();
      const birthDate = new Date(today.getFullYear(), today.getMonth(), today.getDate()); // Born today
      component.userCreationForm.controls['dateOfBirth'].setValue(birthDate.toISOString().split('T')[0]);

      const result = component.ageValidator(component.userCreationForm.controls['dateOfBirth']);
      expect(result).toEqual({ underage: true });
    });

    it('should return { underage: true } if the user 150 or older', () => {
      const date = new Date();
      const birthDate = new Date(date.getFullYear() - 160, date.getMonth(), date.getDate());
      component.userCreationForm.controls['dateOfBirth'].setValue(birthDate.toISOString().split('T')[0]);

      const result = component.ageValidator(component.userCreationForm.controls['dateOfBirth']);
      expect(result).toEqual({ underage: true });
    });

    it('should return { underage: true } if the birth date is just before today', () => {
      const today = new Date();
      const birthDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1); // Born yesterday
      component.userCreationForm.controls['dateOfBirth'].setValue(birthDate.toISOString().split('T')[0]);

      const result = component.ageValidator(component.userCreationForm.controls['dateOfBirth']);
      expect(result).toEqual({ underage: true });
    });

    it('should return { invalidDate: true } for invalid date input', () => {
      component.userCreationForm.controls['dateOfBirth'].setValue('invalid-date'); // Invalid date string
      const result = component.ageValidator(component.userCreationForm.controls['dateOfBirth']);
      expect(result).toEqual({ invalidDate: true }); // Expect validation to fail for invalid date
    });
  });

  describe('Password Match Validator', () => {
    let form: FormGroup;

    beforeEach(() => {
      form = formBuilder.group({
        password: ['', Validators.required],
        repeatPassword: ['', Validators.required]
      }, { validators: component.passwordMatchValidator });
    });

    it('should return null when passwords match', () => {
      form.get('password')?.setValue('password123');
      form.get('repeatPassword')?.setValue('password123');

      component.passwordMatchValidator(form);

      expect(form.get('repeatPassword')?.hasError('passwordMismatch')).toBeFalsy();
      expect(form.valid).toBeTruthy();
    });

    it('should set passwordMismatch error when passwords do not match', () => {
      form.get('password')?.setValue('password123');
      form.get('repeatPassword')?.setValue('differentpassword');

      component.passwordMatchValidator(form);

      expect(form.get('repeatPassword')?.hasError('passwordMismatch')).toBeTruthy();
      expect(form.valid).toBeFalsy();
    });

    it('should return null when password or repeatPassword controls are missing', () => {
      const incompleteForm = formBuilder.group({});

      const result = component.passwordMatchValidator(incompleteForm);

      expect(result).toBeNull();
    });
  });
});
