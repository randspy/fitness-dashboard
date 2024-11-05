import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LinkComponent } from '../../../../ui/components/link/link.component';

@Component({
  selector: 'fit-session-page',
  standalone: true,
  imports: [LinkComponent],
  templateUrl: './session-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      :host {
        @apply flex flex-grow flex-col;
      }
    `,
  ],
})
export class SessionPageComponent {}
