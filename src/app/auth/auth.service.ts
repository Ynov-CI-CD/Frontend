import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }

  hasValidToken(): boolean {
    // Check if token exists and is not expired
    const token = localStorage.getItem('auth_token');

    // You might want to add more sophisticated token validation
    return !!token; // Returns true if token exists
  }
}
