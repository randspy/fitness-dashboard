import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PrimeNGConfig } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { themeConfig } from './app.styles';

@Component({
  selector: 'fit-root',
  standalone: true,
  imports: [RouterOutlet, ToastModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'fitness-dashboard';
  constructor(private config: PrimeNGConfig) {
    this.config.theme.set(themeConfig);
  }
}
