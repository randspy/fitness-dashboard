import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { LoggerService } from '../../../core/errors/services/logger.service';

export interface Quote {
  quote: string;
  author: string;
}

interface QuoteApiResponse {
  q: string;
  a: string;
  i: string;
  c: string;
  h: string;
}

@Injectable()
export class MotivationQuoteService {
  http = inject(HttpClient);
  logger = inject(LoggerService);

  getQuote(): Observable<Quote> {
    return this.http.get<QuoteApiResponse[]>('/api/quotes').pipe(
      map(
        ([quote]: QuoteApiResponse[]): Quote => ({
          quote: quote.q.trim(),
          author: quote.a.trim(),
        }),
      ),
      catchError(() => {
        this.logger.error('Error fetching motivation quote');
        return of({
          quote: 'Do not fear failure but rather fear not trying.',
          author: 'Roy T. Bennett',
        });
      }),
    );
  }
}
