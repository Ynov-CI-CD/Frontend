import { TestBed } from '@angular/core/testing';

import { TokenService } from './token.service';

describe('TokenService', () => {
  let tokenService: TokenService;

  beforeAll(() => {
    spyOn(localStorage, 'setItem').and.callThrough();
    spyOn(localStorage, 'getItem').and.callThrough();
    spyOn(localStorage, 'removeItem').and.callThrough();
  });

  beforeEach(() => {
    tokenService = new TokenService();
    localStorage.clear();
  });

  it('should set a token in localStorage when setToken is called', () => {
    const token = 'test_token';

    tokenService.setToken(token);

    expect(localStorage.setItem).toHaveBeenCalledWith('access_token', token);
  });

  it('should get the token from localStorage when getToken is called', () => {
    const token = 'test_token';
    localStorage.setItem('access_token', token);

    const result = tokenService.getToken();

    expect(result).toBe(token);
  });

  it('should return null when no token is set in localStorage', () => {
    localStorage.removeItem('access_token');

    const result = tokenService.getToken();

    expect(result).toBeNull();
  });

  it('should clear the token from localStorage when clearTokens is called', () => {
    localStorage.setItem('access_token', 'test_token');

    tokenService.clearTokens();

    expect(localStorage.removeItem).toHaveBeenCalledWith('access_token');
  });

  it('should return true if the user is logged in (token exists)', () => {
    localStorage.setItem('access_token', 'test_token');

    const result = tokenService.isLoggedIn();

    expect(result).toBeTrue();
  });

  it('should return false if the user is not logged in (no token)', () => {
    localStorage.removeItem('access_token');

    const result = tokenService.isLoggedIn();

    expect(result).toBeFalse();
  });
});
