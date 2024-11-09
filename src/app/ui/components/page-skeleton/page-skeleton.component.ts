import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'fit-page-skeleton',
  standalone: true,
  imports: [],
  templateUrl: './page-skeleton.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageSkeletonComponent {
  title = input.required<string>();
}
