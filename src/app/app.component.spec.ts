import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import {UsersListComponent} from './components/users-list/users-list.component';
import {HttpClientTestingModule, provideHttpClientTesting} from '@angular/common/http/testing';
import {UsersService} from './services/users.service';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent, HttpClientTestingModule],
      providers: [UsersService, provideHttpClientTesting()]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
