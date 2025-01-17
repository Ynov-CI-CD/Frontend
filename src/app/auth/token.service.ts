import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  private TOKEN_KEY = 'access_token';

  public setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  public getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  public clearTokens(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    return !!token;
  }
}
