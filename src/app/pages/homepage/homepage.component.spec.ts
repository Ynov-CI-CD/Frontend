import {TestBed} from '@angular/core/testing';

import {HomepageComponent} from './homepage.component';
import {HttpClientTestingModule, provideHttpClientTesting} from '@angular/common/http/testing';
import {UsersService} from '../../services/users.service';

describe('HomepageComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomepageComponent, HttpClientTestingModule],
      providers: [UsersService, provideHttpClientTesting()]
    }).compileComponents();
  });

  it('should create the homepage component', () => {
    const fixture = TestBed.createComponent(HomepageComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
