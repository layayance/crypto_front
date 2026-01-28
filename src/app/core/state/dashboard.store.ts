import { Injectable, signal } from '@angular/core';
import { forkJoin, of } from 'rxjs';
import { catchError, finalize, map } from 'rxjs/operators';
import { ApiService, Asset, PortfolioSummary, PortfolioValue } from '../services/api.service';
import { InvalidationService } from './invalidation.service';

@Injectable({ providedIn: 'root' })
export class DashboardStore {
  readonly portfolioValue = signal<PortfolioValue | null>(null);
  readonly portfolioSummary = signal<PortfolioSummary | null>(null);
  readonly recentAssets = signal<Asset[]>([]);

  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  private readonly loaded = signal(false);
  
  // Epoch pour ignorer les réponses des requêtes obsolètes
  private requestEpoch = 0;

  constructor(
    private api: ApiService,
    invalidation: InvalidationService
  ) {
    invalidation.on('dashboard').subscribe(() => {
      this.requestEpoch++; // Invalide toutes les requêtes en cours
      this.loaded.set(false);
      this.loading.set(false); // Permet de relancer une requête
      this.portfolioValue.set(null);
      this.portfolioSummary.set(null);
      this.recentAssets.set([]);
      this.error.set(null);
    });
  }

  load(force = false) {
    if (this.loading()) return;
    if (this.loaded() && !force) return;

    const currentEpoch = ++this.requestEpoch;
    this.loading.set(true);
    this.error.set(null);

    forkJoin({
      value: this.api.getPortfolioValue().pipe(catchError(() => of(null))),
      summary: this.api.getPortfolioSummary().pipe(catchError(() => of(null))),
      portfolio: this.api.getPortfolio().pipe(catchError(() => of({ assets: [], count: 0 })))
    }).pipe(
      map(({ value, summary, portfolio }) => ({
        value,
        summary,
        recentAssets: (portfolio.assets || []).slice(-4).reverse()
      })),
      finalize(() => {
        // Ne reset loading que si c'est la requête actuelle
        if (currentEpoch === this.requestEpoch) {
          this.loading.set(false);
        }
      })
    ).subscribe({
      next: ({ value, summary, recentAssets }) => {
        // Ignore si une invalidation a eu lieu entre temps
        if (currentEpoch !== this.requestEpoch) return;
        
        this.portfolioValue.set(value);
        this.portfolioSummary.set(summary);
        this.recentAssets.set(recentAssets);
        this.loaded.set(true);
      },
      error: (err: Error) => {
        if (currentEpoch !== this.requestEpoch) return;
        this.error.set(err.message ?? 'Erreur lors du chargement du dashboard');
        this.loaded.set(false);
      }
    });
  }

  refresh() {
    this.load(true);
  }
}

