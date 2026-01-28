import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

/**
 * PublicGuard
 * - Empêche un utilisateur déjà authentifié d'accéder aux pages publiques (login / register)
 * - Le redirige automatiquement vers le portfolio.
 */
@Injectable({ providedIn: 'root' })
export class PublicGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const token = localStorage.getItem('token');

    if (token) {
      // Déjà connecté → on redirige vers le dashboard
      this.router.navigate(['/dashboard']);
      return false;
    }

    return true;
  }
}

