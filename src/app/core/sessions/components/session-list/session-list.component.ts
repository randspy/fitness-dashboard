import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  TemplateRef,
} from '@angular/core';

import { CardComponent } from '../../../../ui/components/card/card.component';
import { CommonModule, DatePipe } from '@angular/common';
import { Session } from '../../domain/session.model';
import { provideIcons } from '@ng-icons/core';
import { lucidePencil, lucideTrash } from '@ng-icons/lucide';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'fit-session-list',
  standalone: true,
  imports: [CardComponent, DatePipe, CommonModule],
  templateUrl: './session-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    provideIcons({
      lucideTrash,
      lucidePencil,
    }),
    ConfirmationService,
  ],
  styles: [
    `
      :host {
        @apply w-full lg:w-192;
      }
    `,
  ],
})
export class SessionListComponent {
  contentTemplate = input<TemplateRef<{ $implicit: Session }>>();

  sessions = input.required<Session[]>();
  displayActions = input<boolean>(false);

  sessionListIsEmpty = computed(() => this.sessions().length === 0);

  sessionsByDate = computed(() => {
    return this.sessions().toSorted((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
  });
}
