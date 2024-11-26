import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CardComponent } from '../../../../ui/components/card/card.component';
import { MotivationQuoteService } from '../../services/motivation-quote.service';

@Component({
  selector: 'fit-motivation-quote',
  standalone: true,
  imports: [CardComponent],
  templateUrl: './motivation-quote.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MotivationQuoteComponent {
  quoteService = inject(MotivationQuoteService);
  quote = this.quoteService.getQuote();
}
