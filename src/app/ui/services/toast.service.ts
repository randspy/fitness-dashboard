import { inject, Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

export interface ToastConfig {
  severity: 'success' | 'info' | 'warn' | 'error';
  summary: string;
  detail?: string;
}

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private messageService = inject(MessageService);

  show(config: ToastConfig) {
    this.messageService.add({
      ...config,
      sticky: true,
    });
  }
}
