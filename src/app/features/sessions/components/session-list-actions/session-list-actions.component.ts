import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';
import { LinkComponent } from '../../../../ui/components/link/link.component';
import { ButtonComponent } from '../../../../ui/components/button/button.component';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { lucidePencil, lucideTrash } from '@ng-icons/lucide';
import { SessionStoreService } from '../../service/session-store.service';
import { ConfirmationDialogService } from '../../../../ui/services/confirmation-dialog.service';

@Component({
  selector: 'fit-session-list-actions',
  standalone: true,
  imports: [LinkComponent, ButtonComponent, NgIconComponent],
  templateUrl: './session-list-actions.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    provideIcons({
      lucideTrash,
      lucidePencil,
    }),
    ConfirmationDialogService,
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
  confirmationService = inject(ConfirmationDialogService);
  sessionStoreService = inject(SessionStoreService);

  id = input.required<string>();
  name = input.required<string>();

  editAriaLabel = computed(() => `Edit ${this.name()} session`);
  deleteAriaLabel = computed(() => `Delete ${this.name()} session`);

  confirmDeleteSession() {
    this.confirmationService.show({
      header: 'Delete session',
      message: 'Are you sure you want to delete this session?',
      accept: () => {
        this.sessionStoreService.removeSession(this.id());
      },
    });
  }
}
