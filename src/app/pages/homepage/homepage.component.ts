import {Component, inject} from '@angular/core';
import {UsersListComponent} from '../../components/users-list/users-list.component';
import {AuthService} from '../../auth/auth.service';

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [
    UsersListComponent
  ],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.scss'
})
export class HomepageComponent {
  authService = inject(AuthService);
}
