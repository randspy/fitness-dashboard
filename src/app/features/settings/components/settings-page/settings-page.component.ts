import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PageSkeletonComponent } from '../../../../ui/components/page-skeleton/page-skeleton.component';

@Component({
  selector: 'fit-settings-page',
  standalone: true,
  imports: [PageSkeletonComponent],
  templateUrl: './settings-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsPageComponent {}
