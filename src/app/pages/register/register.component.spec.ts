import {TestBed} from '@angular/core/testing';

import {RegisterComponent} from './register.component';
import {HttpClientTestingModule, provideHttpClientTesting} from '@angular/common/http/testing';
import {UsersService} from '../../services/users.service';
import {RouterTestingModule} from '@angular/router/testing';

describe('RegisterComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterComponent, HttpClientTestingModule, RouterTestingModule],
      providers: [UsersService, provideHttpClientTesting()]
    }).compileComponents();
  });

  it('should create the register component', () => {
    const fixture = TestBed.createComponent(RegisterComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
