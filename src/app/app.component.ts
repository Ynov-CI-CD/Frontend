import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {UsersCreationFormComponent} from './components/users-creation-form/users-creation-form.component';
import {UsersListComponent} from './components/users-list/users-list.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, UsersCreationFormComponent, UsersListComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'integration_deploiement_personal_front';
}
