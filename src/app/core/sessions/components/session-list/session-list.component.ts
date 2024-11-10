import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';

import { CardComponent } from '../../../../ui/components/card/card.component';
import { DatePipe } from '@angular/common';
import { Session } from '../../domain/session.model';
import { provideIcons } from '@ng-icons/core';
import { lucideTrash } from '@ng-icons/lucide';
import { NgIconComponent } from '@ng-icons/core';
import { ButtonComponent } from '../../../../ui/components/button/button.component';
import { SessionStore } from '../../store/sessions.store';
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@Component({
  selector: 'fit-session-list',
  standalone: true,
  imports: [
    CardComponent,
    DatePipe,
    ButtonComponent,
    NgIconComponent,
    ConfirmDialogModule,
  ],
  templateUrl: './session-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    provideIcons({
      lucideTrash,
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
  sessionStore = inject(SessionStore);
  confirmationService = inject(ConfirmationService);

  sessions = input.required<Session[]>();
  displayActions = input<boolean>(false);

  sessionListIsEmpty = computed(() => this.sessions().length === 0);

  sessionsByDate = computed(() => {
    return this.sessions().sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
  });

  confirmDeleteSession(id: string) {
    this.confirmationService.confirm({
      header: 'Delete session',
      message: 'Are you sure you want to delete this session?',
      accept: () => {
        this.sessionStore.removeSession(id);
      },
    });
  }
}
