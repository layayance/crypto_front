import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, TimeoutError, throwError, timeout } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { InvalidationService } from '../state/invalidation.service';

export interface Asset {
  id?: number;
  symbol: string;
  name: string;
  quantity: string;
  purchasePrice: string;
  purchaseDate?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface PortfolioResponse {
  assets: Asset[];
  count: number;
}

export interface PortfolioValue {
  totalValue: string;
  totalInvested: string;
  profitLoss: string;
  profitLossPercentage: string;
  currency: string;
}

export interface PortfolioSummary {
  summary: Array<{
    symbol: string;
    name: string;
    totalQuantity: number;
    totalInvested: number;
    currentValue: number;
    profitLoss: number;
    profitLossPercentage: number;
    portfolioPercentage: number;
    count: number;
  }>;
  totalAssets: number;
  uniqueCryptos: number;
  totalValue: string;
  totalInvested: string;
  totalProfitLoss: string;
  totalProfitLossPercentage: string;
}

export interface Distribution {
  distribution: Array<{
    symbol: string;
    name: string;
    value: string;
    percentage: string;
  }>;
  totalValue: string;
}

@Injectable({ providedIn: 'root' })
export class ApiService {
  private baseURL = 'http://localhost:8000/api';
  private readonly requestTimeoutMs = 10000;

  constructor(
    private http: HttpClient,
    private router: Router,
    private invalidation: InvalidationService
  ) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    return headers;
  }

  private handleError(error: unknown): Observable<never> {
    let errorMessage = 'Une erreur est survenue';

    // Timeout RxJS
    if (error instanceof TimeoutError) {
      errorMessage = 'Le serveur met trop de temps à répondre. Réessayez.';
      return throwError(() => new Error(errorMessage));
    }

    // Erreur HTTP classique
    if (error instanceof HttpErrorResponse) {
      if (error.error instanceof ErrorEvent) {
        errorMessage = `Erreur: ${error.error.message}`;
      } else {
        if (error.status === 401) {
          errorMessage = 'Token expiré ou invalide. Veuillez vous reconnecter.';
          localStorage.removeItem('token');
          this.invalidation.invalidateAll();
          this.router.navigate(['/login']);
        } else if ((error.error as any)?.error) {
          errorMessage = (error.error as any).error;
        } else {
          errorMessage = `Erreur ${error.status}: ${error.message}`;
        }
      }
      return throwError(() => new Error(errorMessage));
    }

    // Fallback
    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return throwError(() => new Error(errorMessage));
  }

  // Authentification
  register(email: string, password: string): Observable<any> {
    return this.http.post(`${this.baseURL}/register`, { email, password }).pipe(
      timeout(this.requestTimeoutMs),
      catchError(this.handleError.bind(this))
    );
  }

  login(email: string, password: string): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(`${this.baseURL}/login`, { email, password }).pipe(
      timeout(this.requestTimeoutMs),
      catchError(this.handleError.bind(this))
    );
  }

  getMe(): Observable<any> {
    return this.http.get(`${this.baseURL}/me`, { headers: this.getHeaders() }).pipe(
      timeout(this.requestTimeoutMs),
      catchError(this.handleError.bind(this))
    );
  }

  // Portefeuille
  getPortfolio(): Observable<PortfolioResponse> {
    return this.http.get<PortfolioResponse>(`${this.baseURL}/portfolio`, { headers: this.getHeaders() }).pipe(
      timeout(this.requestTimeoutMs),
      catchError(this.handleError.bind(this))
    );
  }

  getAsset(id: number): Observable<Asset> {
    return this.http.get<Asset>(`${this.baseURL}/portfolio/${id}`, { headers: this.getHeaders() }).pipe(
      timeout(this.requestTimeoutMs),
      catchError(this.handleError.bind(this))
    );
  }

  addAsset(asset: Asset): Observable<Asset> {
    return this.http.post<Asset>(`${this.baseURL}/portfolio`, asset, { headers: this.getHeaders() }).pipe(
      timeout(this.requestTimeoutMs),
      catchError(this.handleError.bind(this))
    );
  }

  updateAsset(id: number, updates: Partial<Asset>): Observable<Asset> {
    return this.http.put<Asset>(`${this.baseURL}/portfolio/${id}`, updates, { headers: this.getHeaders() }).pipe(
      timeout(this.requestTimeoutMs),
      catchError(this.handleError.bind(this))
    );
  }

  deleteAsset(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseURL}/portfolio/${id}`, { headers: this.getHeaders() }).pipe(
      timeout(this.requestTimeoutMs),
      catchError(this.handleError.bind(this))
    );
  }

  // Statistiques
  getPortfolioValue(): Observable<PortfolioValue> {
    return this.http.get<PortfolioValue>(`${this.baseURL}/stats/portfolio/value`, { headers: this.getHeaders() }).pipe(
      timeout(this.requestTimeoutMs),
      catchError(this.handleError.bind(this))
    );
  }

  getPortfolioSummary(): Observable<PortfolioSummary> {
    return this.http.get<PortfolioSummary>(`${this.baseURL}/stats/portfolio/summary`, { headers: this.getHeaders() }).pipe(
      timeout(this.requestTimeoutMs),
      catchError(this.handleError.bind(this))
    );
  }

  getPortfolioHistory(): Observable<any> {
    return this.http.get(`${this.baseURL}/stats/portfolio/history`, { headers: this.getHeaders() }).pipe(
      timeout(this.requestTimeoutMs),
      catchError(this.handleError.bind(this))
    );
  }

  getPortfolioDistribution(): Observable<Distribution> {
    return this.http.get<Distribution>(`${this.baseURL}/stats/portfolio/distribution`, { headers: this.getHeaders() }).pipe(
      timeout(this.requestTimeoutMs),
      catchError(this.handleError.bind(this))
    );
  }
}
