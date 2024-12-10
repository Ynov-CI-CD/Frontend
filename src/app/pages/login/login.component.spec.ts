import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginComponent } from './login.component';
import {HomepageComponent} from '../homepage/homepage.component';
import {HttpClientTestingModule, provideHttpClientTesting} from '@angular/common/http/testing';
import {UsersService} from '../../services/users.service';
import {RouterTestingModule} from '@angular/router/testing';

describe('LoginComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginComponent, HttpClientTestingModule, RouterTestingModule],
      providers: [provideHttpClientTesting()]
    }).compileComponents();
  });

  it('should create the login component', () => {
    const fixture = TestBed.createComponent(LoginComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
