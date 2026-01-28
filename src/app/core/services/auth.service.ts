import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { ApiService } from "./api.service";
import { InvalidationService } from "../state/invalidation.service";
import { catchError, tap } from "rxjs/operators";
import { throwError } from "rxjs";

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(
    private apiService: ApiService,
    private router: Router,
    private invalidation: InvalidationService
  ) {}

  login(email: string, password: string) {
    return this.apiService.login(email, password).pipe(
      tap(response => {
        localStorage.setItem('token', response.token);
        // Changement de session => on purge tous les caches
        this.invalidation.invalidateAll();
      }),
      catchError(error => {
        return throwError(() => error);
      })
    );
  }

  register(email: string, password: string) {
    return this.apiService.register(email, password).pipe(
      catchError(error => {
        return throwError(() => error);
      })
    );
  }

  logout() {
    localStorage.removeItem('token');
    // Déconnexion => purge caches pour éviter les données du compte précédent
    this.invalidation.invalidateAll();
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }
}
