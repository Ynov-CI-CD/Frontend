import { Component } from '@angular/core';
import {UsersCreationFormComponent} from '../../components/users-creation-form/users-creation-form.component';
import {UsersListComponent} from '../../components/users-list/users-list.component';

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [
    UsersCreationFormComponent,
    UsersListComponent
  ],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.scss'
})
export class HomepageComponent {

}
