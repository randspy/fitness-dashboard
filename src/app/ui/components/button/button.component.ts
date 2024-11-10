import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'fit-button',
  standalone: true,
  imports: [ButtonModule],
  templateUrl: './button.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonComponent {
  styleClass = input<string>('');
  type = input<string>('button');
  disabled = input(false);
  onClick = output<void>();
  text = input<boolean>(false);
  raised = input<boolean>(true);
  severity = input<
    | 'success'
    | 'info'
    | 'warn'
    | 'danger'
    | 'help'
    | 'primary'
    | 'secondary'
    | 'contrast'
    | null
    | undefined
  >('primary');
}
