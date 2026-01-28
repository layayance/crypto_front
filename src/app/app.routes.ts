import { Routes } from '@angular/router';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout';
import { MainLayoutComponent } from './layouts/main-layout/main-layout';
import { AuthGuard } from './core/guards/auth.guard';
import { PublicGuard } from './core/guards/public.guard';

export const routes: Routes = [
  // Zone publique : login / register
  {
    path: '',
    component: AuthLayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full',
      },
      {
        path: 'login',
        canActivate: [PublicGuard],
        loadComponent: () =>
          import('./auth/login/login').then(m => m.LoginComponent),
      },
      {
        path: 'register',
        canActivate: [PublicGuard],
        loadComponent: () =>
          import('./auth/register/register').then(m => m.RegisterComponent),
      },
    ],
  },

  // Zone protégée : nécessite un token
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./dashboard/dashboard').then(m => m.DashboardComponent),
      },
      {
        path: 'portfolio',
        loadComponent: () =>
          import('./portfolio/portfolio').then(m => m.PortfolioComponent),
      },
      {
        path: 'stats',
        loadComponent: () =>
          import('./stats/stats').then(m => m.StatsComponent),
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard',
      },
    ],
  },

  { path: '**', redirectTo: 'login' },
];

