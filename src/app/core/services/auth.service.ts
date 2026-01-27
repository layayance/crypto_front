import { Injectable } from "@angular/core";

@Injectable({ providedIn: 'root' })
export class AuthService {
  login(email: string, password: string) {
    localStorage.setItem('token', 'fake-jwt');
  }

  logout() {
    localStorage.removeItem('token');
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }
}
