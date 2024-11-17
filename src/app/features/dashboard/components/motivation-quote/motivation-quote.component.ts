import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
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
  quote = toSignal(this.quoteService.getQuote(), { initialValue: null });
}
