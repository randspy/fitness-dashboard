import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';

import { CardComponent } from '../../../../ui/components/card/card.component';
import { DatePipe } from '@angular/common';
import { Session } from '../../domain/session.model';

@Component({
  selector: 'fit-session-list',
  standalone: true,
  imports: [CardComponent, DatePipe],
  templateUrl: './session-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      :host {
        @apply w-full lg:w-192;
      }
    `,
  ],
})
export class SessionListComponent {
  sessions = input.required<Session[]>();

  sessionListIsEmpty = computed(() => this.sessions().length === 0);

  sessionsByDate = computed(() => {
    return this.sessions().sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
  });
}
