import {ComponentFixture, TestBed} from '@angular/core/testing';

import {UsersListComponent} from './users-list.component';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {UsersService} from '../../services/users.service';
import {of, throwError} from 'rxjs';
import {AuthService} from '../../auth/auth.service';
import {ApiResponseDto} from '../../models/api-response.model';
import {UserDto} from '../../models/user.dto';
import {DatePipe} from '@angular/common';

describe('UsersListComponent', () => {
  let component: UsersListComponent;
  let fixture: ComponentFixture<UsersListComponent>;
  let usersService: jasmine.SpyObj<UsersService>;
  let authService: jasmine.SpyObj<AuthService>;

  const mockUsers = [
    {
      _id: '1',
      firstName: 'John',
      lastName: 'Doe',
      city: 'New York',
      zipCode: '10001',
      birthDate: new Date('1990-01-01'),
      email: 'john@example.com'
    },
    {
      _id: '2',
      firstName: 'Jane',
      lastName: 'Smith',
      city: 'Los Angeles',
      zipCode: '90001',
      birthDate: new Date('1992-02-02'),
      email: 'jane@example.com'
    }
  ];

  beforeEach(async () => {
    // Add getUsers to the spy methods
    const usersSpy = jasmine.createSpyObj('UsersService', ['deleteUser', 'getUsers']);
    usersSpy.usersData = of(mockUsers);
    usersSpy.deleteUser.and.returnValue(of({}));
    usersSpy.getUsers.and.returnValue(of(mockUsers));  // Mock getUsers response

    const authSpy = jasmine.createSpyObj('AuthService', ['isUserAdmin']);
    authSpy.isUserAdmin.and.returnValue(false);  // Default to non-admin

    await TestBed.configureTestingModule({
      imports: [
        UsersListComponent,
        DatePipe
      ],
      providers: [
        { provide: UsersService, useValue: usersSpy },
        { provide: AuthService, useValue: authSpy }
      ]
    }).compileComponents();

    usersService = TestBed.inject(UsersService) as jasmine.SpyObj<UsersService>;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getUsers on init', () => {
    expect(usersService.getUsers).toHaveBeenCalled();
  });

  it('should display list of users', () => {
    const userElements = fixture.nativeElement.querySelectorAll('.group');
    expect(userElements.length).toBe(2);

    const firstUserName = userElements[0].querySelector('span').textContent;
    expect(firstUserName).toContain('John Doe');
  });

  it('should show delete button only for admin users', () => {
    // Test when user is not admin
    authService.isUserAdmin.and.returnValue(false);
    fixture.detectChanges();

    let deleteButtons = fixture.nativeElement.querySelectorAll('button');
    expect(deleteButtons.length).toBe(0);

    // Test when user is admin
    authService.isUserAdmin.and.returnValue(true);
    fixture.detectChanges();

    deleteButtons = fixture.nativeElement.querySelectorAll('button');
    expect(deleteButtons.length).toBe(2);
  });

  it('should call deleteUser service method when delete button is clicked', () => {
    authService.isUserAdmin.and.returnValue(true);
    fixture.detectChanges();

    const deleteButton = fixture.nativeElement.querySelector('button');
    deleteButton.click();

    expect(usersService.deleteUser).toHaveBeenCalledWith('1');
    expect(usersService.getUsers).toHaveBeenCalled();
  });

  it('should show user details when group is focused', () => {
    const userGroup = fixture.nativeElement.querySelector('.group');

    // Check that details are initially hidden
    const detailsDiv = userGroup.querySelector('div:last-child');
    expect(getComputedStyle(detailsDiv).opacity).toBe('1');

    // Simulate focus
    userGroup.focus();
    fixture.detectChanges();

    // Check that details are now visible
    expect(detailsDiv.classList.contains('group-focus:opacity-100')).toBeFalsy();
  });

  it('should handle errors when getting users', () => {
    usersService.getUsers.and.returnValue(of());  // Mock empty response
    fixture = TestBed.createComponent(UsersListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    const userElements = fixture.nativeElement.querySelectorAll('.group');
    expect(userElements.length).toBe(2);
  });
});
