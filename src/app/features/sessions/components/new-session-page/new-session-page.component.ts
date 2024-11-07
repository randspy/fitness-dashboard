import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SessionFormComponent } from '../session-form/session-form.component';

@Component({
  selector: 'fit-new-session-page',
  standalone: true,
  imports: [SessionFormComponent],
  templateUrl: './new-session-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      :host {
        @apply flex-grow;
      }
    `,
  ],
})
export class NewSessionPageComponent {}
