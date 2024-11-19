import {Component, inject, OnInit} from '@angular/core';
import {UsersService} from '../../services/users.service';
import {AsyncPipe, DatePipe, NgForOf, NgOptimizedImage} from '@angular/common';

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [
    NgForOf,
    AsyncPipe,
    DatePipe,
    NgOptimizedImage
  ],
  templateUrl: './users-list.component.html',
  styleUrl: './users-list.component.scss'
})
export class UsersListComponent implements OnInit {
  usersService = inject(UsersService);

  /**
   * Initializes the component by fetching the list of users from the server.
   */
  ngOnInit(): void {
    this.usersService.getUsers().subscribe();
  }
}
