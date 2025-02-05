import {TestBed} from '@angular/core/testing';

import {UsersService} from './users.service';
import {HttpClientTestingModule, HttpTestingController, provideHttpClientTesting} from '@angular/common/http/testing';
import {UserDto} from '../models/user.dto';
import {environment} from '../../environments/environment';

describe('UsersService', () => {
  let service: UsersService;
  let httpTestingController: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UsersService, provideHttpClientTesting()]
    }).compileComponents();

    TestBed.configureTestingModule({});
    service = TestBed.inject(UsersService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getUsers', () => {
    it('should return expected users (HttpClient called once)', () => {
      const expectedUsers: UserDto[] = [
        { _id: "1", firstName: 'John', lastName: 'Doe', email: 'john@example.com', birthDate: new Date('1990-01-01'), city: 'CityA', zipCode: '12345', role: 'user' },
        { _id: "2", firstName: 'Jane', lastName: 'Smith', email: 'jane@example.com', birthDate: new Date('1992-02-02'), city: 'CityB', zipCode: '67890', role: 'user' },
      ];

      const apiResponse = {
        data: expectedUsers
      };

      service.getUsers().subscribe((response) => {
        expect(response.data).toEqual(expectedUsers);
      });

      const req = httpTestingController.expectOne(`${environment.apiUrl}/users`);
      expect(req.request.method).toEqual('GET');

      req.flush(apiResponse);

      service.usersData.subscribe((users) => {
        expect(users).toEqual(expectedUsers);
      });
    });
  });

  describe('deleteUser', () => {
    it('should delete the user and update the usersData subject', () => {
      const userIdToDelete = '1';
      const initialUsers: UserDto[] = [
        { _id: "1", firstName: 'John', lastName: 'Doe', email: 'john@example.com', birthDate: new Date('1990-01-01'), city: 'CityA', zipCode: '12345', role: 'user' },
        { _id: "2", firstName: 'Jane', lastName: 'Smith', email: 'jane@example.com', birthDate: new Date('1992-02-02'), city: 'CityB', zipCode: '67890', role: 'user' },
      ];

      const expectedUsersAfterDelete: UserDto[] = [
        { _id: "2", firstName: 'Jane', lastName: 'Smith', email: 'jane@example.com', birthDate: new Date('1992-02-02'), city: 'CityB', zipCode: '67890', role: 'user' },
      ];

      service.usersData.next(initialUsers);

      service.deleteUser(userIdToDelete).subscribe(() => {
        service.usersData.subscribe((users) => {
          expect(users).toEqual(expectedUsersAfterDelete);
        });
      });

      const req = httpTestingController.expectOne(`${environment.apiUrl}/users/${userIdToDelete}`);
      expect(req.request.method).toEqual('DELETE');

      req.flush(null);
    });
  });
});
