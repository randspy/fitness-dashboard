import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PrimeNGConfig } from 'primeng/api';
import { ButtonModule } from 'primeng/button';

import { themeConfig } from './app.styles';

@Component({
  selector: 'fit-root',
  standalone: true,
  imports: [RouterOutlet, ButtonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'fitness-dashboard';
  constructor(private config: PrimeNGConfig) {
    this.config.theme.set(themeConfig);
  }
}
