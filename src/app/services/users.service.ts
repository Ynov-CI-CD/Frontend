import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {BehaviorSubject, map, Observable, tap} from 'rxjs';
import {CreateUserDto, UserDto} from '../models/user.dto';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  usersApiUrl = `${environment.apiUrl}/users`;

  usersData = new BehaviorSubject<UserDto[]>([])

  constructor(public http: HttpClient) { }

  /**
   * Fetches the list of users from the server and updates the local data.
   *
   * @returns {Observable<UserDto[]>} An observable that emits the list of users.
   */
  getUsers(): Observable<UserDto[]> {
    return this.http.get<UserDto[]>(this.usersApiUrl)
      .pipe(tap(users => this.usersData.next(users)));
  }

  /**
   * Creates a new user by sending a POST request to the server and updates the local data.
   *
   * @param {CreateUserDto} createUserDto The data for creating the new user.
   * @returns {Observable<UserDto>} An observable that emits the created user.
   */
  createUser(createUserDto: Omit<CreateUserDto, 'repeatPassword'>): Observable<UserDto> {
    return this.http.post<UserDto>(this.usersApiUrl, createUserDto)
      .pipe(tap(user => this.usersData.next([...this.usersData.value, user])));
  }
}
