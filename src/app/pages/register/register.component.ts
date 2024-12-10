import { Component } from '@angular/core';
import {UsersListComponent} from "../../components/users-list/users-list.component";
import {UsersCreationFormComponent} from '../../components/users-creation-form/users-creation-form.component';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    UsersListComponent,
    UsersCreationFormComponent,
    RouterLink
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {

}
