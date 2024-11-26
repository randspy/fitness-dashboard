import { toSignal } from '@angular/core/rxjs-interop';
import { HttpClient } from '@angular/common/http';
import {
  Injectable,
  Injector,
  Signal,
  inject,
  runInInjectionContext,
  signal,
} from '@angular/core';
import { catchError, map, of, tap } from 'rxjs';
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
  private readonly http = inject(HttpClient);
  private readonly logger = inject(LoggerService);
  private readonly injector = inject(Injector);

  private quotesCache = signal<Quote[]>([]);

  getQuote(): Signal<Quote | null> {
    if (this.quotesCache().length > 0) {
      return signal(this.getRandomQuote(this.quotesCache()));
    }

    return runInInjectionContext(this.injector, () =>
      toSignal(
        this.http.get<QuoteApiResponse[]>('/api/quotes').pipe(
          map((quotes: QuoteApiResponse[]): Quote[] =>
            quotes.map((quote) => ({
              quote: quote.q.trim(),
              author: quote.a.trim(),
            })),
          ),
          tap((quotes: Quote[]) => {
            this.quotesCache.set(quotes);
          }),
          map((quotes: Quote[]) => this.getRandomQuote(quotes)),
          catchError(() => {
            this.logger.error('Error fetching motivation quote');
            return of<Quote>({
              quote: 'Do not fear failure but rather fear not trying.',
              author: 'Roy T. Bennett',
            });
          }),
        ),
        { initialValue: null },
      ),
    );
  }

  getRandomQuote(quotes: Quote[]): Quote {
    return quotes[Math.floor(Math.random() * quotes.length)];
  }
}
