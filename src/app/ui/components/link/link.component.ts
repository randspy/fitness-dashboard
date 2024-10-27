import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'fit-link',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './link.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LinkComponent {
  link = input.required<string>();
}
