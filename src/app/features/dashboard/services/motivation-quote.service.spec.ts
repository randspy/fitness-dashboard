import { TestBed } from '@angular/core/testing';
import { MotivationQuoteService } from './motivation-quote.service';
import { firstValueFrom } from 'rxjs';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';

describe('MotivationQuoteService', () => {
  let service: MotivationQuoteService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        MotivationQuoteService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject(MotivationQuoteService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch quote', async () => {
    const mockResponse = [{ q: 'Test quote', a: 'Test author' }];

    const quotePromise = firstValueFrom(service.getQuote());

    const req = httpMock.expectOne('/api/quotes');
    req.flush(mockResponse);

    const quote = await quotePromise;
    expect(quote.quote).toBe('Test quote');
    expect(quote.author).toBe('Test author');
  });

  it('should handle error', async () => {
    const quotePromise = firstValueFrom(service.getQuote());

    const req = httpMock.expectOne('/api/quotes');
    req.error(new ProgressEvent('Network error'));

    const quote = await quotePromise;
    expect(quote.quote).toBe('Do not fear failure but rather fear not trying.');
    expect(quote.author).toBe('Roy T. Bennett');
  });
});
