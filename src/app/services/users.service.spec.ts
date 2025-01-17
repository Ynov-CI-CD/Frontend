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

      service.getUsers().subscribe((users) => {
        expect(users.data).toEqual(expectedUsers);
      });

      const req = httpTestingController.expectOne(`${environment.apiUrl}/users`);
      expect(req.request.method).toEqual('GET');

      req.flush(expectedUsers);

      service.usersData.subscribe((users) => {
        expect(users).toEqual(expectedUsers);
      });
    });
  });

  // describe('createUser', () => {
  //   it('should add a new user and return it', () => {
  //     const newUser: CreateUserDto = {
  //       firstName: 'Alice',
  //       lastName: 'Brown',
  //       email: 'alice@example.com',
  //       birthDate: new Date('1995-05-05'),
  //       city: 'CityC',
  //       zipCode: '54321',
  //       password: 'password123',
  //       repeatPassword: 'password123'
  //     };
  //
  //     const createdUser: UserDto = { id: 3, role: 'user', ...newUser };
  //
  //     service.createUser(newUser).subscribe(user => {
  //       expect(user).toEqual(createdUser);
  //     });
  //
  //     const req = httpTestingController.expectOne(`${environment.apiUrl}/users`);
  //     expect(req.request.method).toEqual('POST');
  //     expect(req.request.body).toEqual(newUser);
  //
  //     req.flush(createdUser);
  //
  //     service.usersData.subscribe(users => {
  //       expect(users).toEqual([createdUser]);
  //     });
  //   });
  // });
});
