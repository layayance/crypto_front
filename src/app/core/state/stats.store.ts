import { Injectable, signal } from '@angular/core';
import { forkJoin, of } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { ApiService, Distribution, PortfolioSummary, PortfolioValue } from '../services/api.service';
import { InvalidationService } from './invalidation.service';

@Injectable({ providedIn: 'root' })
export class StatsStore {
  readonly portfolioValue = signal<PortfolioValue | null>(null);
  readonly portfolioSummary = signal<PortfolioSummary | null>(null);
  readonly distribution = signal<Distribution | null>(null);
  readonly history = signal<any[] | null>(null);

  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  private readonly loaded = signal(false);
  
  // Epoch pour ignorer les réponses des requêtes obsolètes
  private requestEpoch = 0;

  constructor(
    private api: ApiService,
    invalidation: InvalidationService
  ) {
    invalidation.on('stats').subscribe(() => {
      this.requestEpoch++; // Invalide toutes les requêtes en cours
      this.loaded.set(false);
      this.loading.set(false); // Permet de relancer une requête
      this.portfolioValue.set(null);
      this.portfolioSummary.set(null);
      this.distribution.set(null);
      this.history.set(null);
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
      dist: this.api.getPortfolioDistribution().pipe(catchError(() => of(null))),
      history: this.api.getPortfolioHistory().pipe(catchError(() => of([])))
    }).pipe(
      finalize(() => {
        if (currentEpoch === this.requestEpoch) {
          this.loading.set(false);
        }
      })
    ).subscribe({
      next: ({ value, summary, dist, history }) => {
        // Ignore si une invalidation a eu lieu entre temps
        if (currentEpoch !== this.requestEpoch) return;
        
        this.portfolioValue.set(value);
        this.portfolioSummary.set(summary);
        this.distribution.set(dist);
        this.history.set(Array.isArray(history) ? history : (history?.history || []));
        this.loaded.set(true);
      },
      error: (err: Error) => {
        if (currentEpoch !== this.requestEpoch) return;
        this.error.set(err.message ?? 'Erreur lors du chargement des statistiques');
        this.loaded.set(false);
      }
    });
  }

  refresh() {
    this.load(true);
  }
}

