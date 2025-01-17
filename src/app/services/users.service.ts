import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {BehaviorSubject, Observable, tap} from 'rxjs';
import {UserDto} from '../models/user.dto';
import {ApiResponseDto} from '../models/api-response.model';

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
  getUsers(): Observable<ApiResponseDto<UserDto>> {
    return this.http.get<ApiResponseDto<UserDto>>(this.usersApiUrl)
      .pipe(tap(users => this.usersData.next(users.data)));
  }


  /**
   * Delete a user by sending a DELETE request to the server.
   *
   * @param {string} userId The id to delete the user.
   * @returns {Observable<UserDto>} An observable that emits and event of delete.
   */
  deleteUser(userId: string): Observable<void> {
    return this.http.delete<void>(`${this.usersApiUrl}/${userId}`).pipe(
      tap(() => {
        const updatedUsers = this.usersData.value.filter(user => user._id !== userId);
        this.usersData.next(updatedUsers);
      })
    );
  }
}
