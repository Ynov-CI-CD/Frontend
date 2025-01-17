import {Component, inject, OnInit} from '@angular/core';
import {UsersService} from '../../services/users.service';
import {AsyncPipe, DatePipe, NgForOf, NgIf, NgOptimizedImage} from '@angular/common';
import {AuthService} from '../../auth/auth.service';

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [
    NgForOf,
    AsyncPipe,
    DatePipe,
    NgOptimizedImage,
    NgIf
  ],
  templateUrl: './users-list.component.html',
  styleUrl: './users-list.component.scss'
})
export class UsersListComponent implements OnInit {
  usersService = inject(UsersService);
  authService = inject(AuthService);

  /**
   * Initializes the component by fetching the list of users from the server.
   */
  ngOnInit(): void {
    this.usersService.getUsers().subscribe();
  }

  deleteUser(id: string) {
    this.usersService.deleteUser(id).subscribe();
  }
}
