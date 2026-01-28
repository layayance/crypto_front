import { Injectable, signal } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { ApiService, Asset } from '../services/api.service';
import { InvalidationService } from './invalidation.service';

@Injectable({ providedIn: 'root' })
export class PortfolioStore {
  readonly assets = signal<Asset[]>([]);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  private readonly loaded = signal(false);
  
  // Epoch pour ignorer les réponses des requêtes obsolètes
  private requestEpoch = 0;

  constructor(
    private api: ApiService,
    invalidation: InvalidationService
  ) {
    invalidation.on('portfolio').subscribe(() => {
      this.requestEpoch++; // Invalide toutes les requêtes en cours
      this.loaded.set(false);
      this.loading.set(false); // Permet de relancer une requête
      this.assets.set([]);
      this.error.set(null);
    });
  }

  load(force = false) {
    if (this.loading()) return;
    if (this.loaded() && !force) return;

    const currentEpoch = ++this.requestEpoch;
    this.loading.set(true);
    this.error.set(null);

    this.api.getPortfolio().pipe(
      finalize(() => {
        if (currentEpoch === this.requestEpoch) {
          this.loading.set(false);
        }
      })
    ).subscribe({
      next: (res) => {
        // Ignore si une invalidation a eu lieu entre temps
        if (currentEpoch !== this.requestEpoch) return;
        
        this.assets.set(res.assets ?? []);
        this.loaded.set(true);
      },
      error: (err: Error) => {
        if (currentEpoch !== this.requestEpoch) return;
        this.error.set(err.message ?? 'Erreur lors du chargement du portefeuille');
        this.loaded.set(false);
      }
    });
  }

  refresh() {
    this.load(true);
  }
}

