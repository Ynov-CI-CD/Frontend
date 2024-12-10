import { Routes } from '@angular/router';
import {LoginComponent} from './pages/login/login.component';
import {RegisterComponent} from './pages/register/register.component';
import {HomepageComponent} from './pages/homepage/homepage.component';
import {auth} from '@octokit/auth-token/dist-types/auth';
import {authGuard} from './auth/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'register',
    component: RegisterComponent,
  },
  {
    path: '',
    component: HomepageComponent,
    canActivate: [authGuard],
  },
  {
    path: '**',
    redirectTo: ''
  }
];
