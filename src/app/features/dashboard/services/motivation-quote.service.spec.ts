import { TestBed } from '@angular/core/testing';
import { MotivationQuoteService } from './motivation-quote.service';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { LoggerService } from '../../../core/errors/services/logger.service';
import { mockLoggerService } from '../../../../tests/mock-logger-service';

describe('MotivationQuoteService', () => {
  let service: MotivationQuoteService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        MotivationQuoteService,
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: LoggerService, useValue: mockLoggerService },
      ],
    });

    service = TestBed.inject(MotivationQuoteService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    jest.clearAllMocks();
    httpMock.verify();
    TestBed.resetTestingModule();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch quote', async () => {
    const mockResponse = [{ q: 'Test quote', a: 'Test author' }];

    const quote = service.getQuote();

    const req = httpMock.expectOne('/api/quotes');
    req.flush(mockResponse);

    expect(quote()).toEqual({
      quote: 'Test quote',
      author: 'Test author',
    });
  });

  it('should get random quote from cache', async () => {
    jest.spyOn(Math, 'random').mockReturnValue(0.5);
    const mockResponse = [
      { q: 'Test quote', a: 'Test author' },
      { q: 'Test quote 2', a: 'Test author 2' },
      { q: 'Test quote 3', a: 'Test author 3' },
    ];

    service.getQuote();

    const req = httpMock.expectOne('/api/quotes');
    req.flush(mockResponse);

    const quote = service.getQuote();

    expect(quote()).toEqual({
      quote: 'Test quote 2',
      author: 'Test author 2',
    });
  });

  it('should handle error', async () => {
    const quote = service.getQuote();

    const req = httpMock.expectOne('/api/quotes');
    req.error(new ProgressEvent('Network error'));

    expect(quote()).toEqual({
      quote: 'Do not fear failure but rather fear not trying.',
      author: 'Roy T. Bennett',
    });
  });

  it('should log error', () => {
    service.getQuote();
    httpMock.expectOne('/api/quotes').error(new ProgressEvent('Network error'));
    expect(mockLoggerService.error).toHaveBeenCalledWith(
      'Error fetching motivation quote',
    );
  });
});
