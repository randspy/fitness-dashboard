import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PrimeNGConfig } from 'primeng/api';
import { themeConfig } from './app.styles';
import { ToastComponent } from './ui/components/toast/toast.component';

@Component({
  selector: 'fit-root',
  standalone: true,
  imports: [RouterOutlet, ToastComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  constructor(private config: PrimeNGConfig) {
    this.config.theme.set(themeConfig);
  }
}
