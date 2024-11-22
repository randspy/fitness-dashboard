import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';
import { LinkComponent } from '../../../../ui/components/link/link.component';
import { ButtonComponent } from '../../../../ui/components/button/button.component';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { lucidePencil, lucideTrash } from '@ng-icons/lucide';
import { ConfirmationService } from 'primeng/api';
import { SessionStoreService } from '../../service/session-store.service';

@Component({
  selector: 'fit-session-list-actions',
  standalone: true,
  imports: [
    LinkComponent,
    ButtonComponent,
    NgIconComponent,
    ConfirmDialogModule,
  ],
  templateUrl: './session-list-actions.component.html',
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
        @apply ml-auto flex gap-2;
      }
    `,
  ],
})
export class SessionListActionsComponent {
  confirmationService = inject(ConfirmationService);
  sessionStoreService = inject(SessionStoreService);

  id = input.required<string>();
  name = input.required<string>();

  editAriaLabel = computed(() => `Edit ${this.name()} session`);
  deleteAriaLabel = computed(() => `Delete ${this.name()} session`);

  confirmDeleteSession() {
    this.confirmationService.confirm({
      header: 'Delete session',
      message: 'Are you sure you want to delete this session?',
      accept: () => {
        this.sessionStoreService.removeSession(this.id());
      },
    });
  }
}
