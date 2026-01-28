import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { filter } from 'rxjs/operators';

export type CacheKey = 'portfolio' | 'stats' | 'dashboard';

@Injectable({ providedIn: 'root' })
export class InvalidationService {
  private readonly subject = new Subject<CacheKey[]>();

  invalidate(keys: CacheKey | CacheKey[]) {
    const list = Array.isArray(keys) ? keys : [keys];
    this.subject.next(list);
  }

  invalidateAll() {
    this.subject.next(['portfolio', 'stats', 'dashboard']);
  }

  on(keys: CacheKey | CacheKey[]): Observable<CacheKey[]> {
    const wanted = new Set(Array.isArray(keys) ? keys : [keys]);
    return this.subject.asObservable().pipe(
      filter((incoming) => incoming.some((k) => wanted.has(k)))
    );
  }
}

