import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MotivationQuoteComponent } from './motivation-quote.component';
import { MotivationQuoteService } from '../../services/motivation-quote.service';
import { provideHttpClient } from '@angular/common/http';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { provideTestLogger } from '../../../../../tests/provide-test-logger';

describe('MotivationQuoteComponent', () => {
  let component: MotivationQuoteComponent;
  let fixture: ComponentFixture<MotivationQuoteComponent>;
  let quoteService: MotivationQuoteService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MotivationQuoteComponent],
      providers: [
        MotivationQuoteService,
        provideHttpClient(),
        provideTestLogger(),
      ],
    }).compileComponents();

    quoteService = TestBed.inject(MotivationQuoteService);
  });

  it('should create', () => {
    fixture = TestBed.createComponent(MotivationQuoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should display quote from service', () => {
    const quote = 'Test quote';
    const author = 'Test author';

    jest.spyOn(quoteService, 'getQuote').mockReturnValue(of({ quote, author }));

    fixture = TestBed.createComponent(MotivationQuoteComponent);
    fixture.detectChanges();

    const quoteElement = fixture.debugElement.query(By.css('blockquote'));
    expect(quoteElement.nativeElement.textContent).toContain(quote);

    const authorElement = fixture.debugElement.query(By.css('p'));
    expect(authorElement.nativeElement.textContent).toContain(author);
  });

  it('should display loading message when quote is loading', () => {
    fixture = TestBed.createComponent(MotivationQuoteComponent);
    fixture.detectChanges();

    const loadingElement = fixture.debugElement.query(By.css('div'));
    expect(loadingElement.nativeElement.textContent).toContain(
      'Loading quote...',
    );
  });
});
