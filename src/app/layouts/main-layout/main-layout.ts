import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { RouterOutlet, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ApiService } from '../../core/services/api.service';

@Component({
  standalone: true,
  selector: 'app-main-layout',
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './main-layout.html',
  styleUrls: ['./main-layout.scss']
})
export class MainLayoutComponent implements OnInit {
  userEmail: string | null = null;

  constructor(
    private authService: AuthService,
    private apiService: ApiService
  ) {}

  ngOnInit() {
    this.loadUserInfo();
  }

  loadUserInfo() {
    this.apiService.getMe().subscribe({
      next: (user) => {
        this.userEmail = user.email;
      },
      error: () => {
        // En cas d'erreur, on ne bloque pas l'application
        this.userEmail = null;
      }
    });
  }

  logout() {
    this.authService.logout();
  }
}