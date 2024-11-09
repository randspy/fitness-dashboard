import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'fit-settings-page',
  standalone: true,
  imports: [],
  templateUrl: './settings-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsPageComponent {}
