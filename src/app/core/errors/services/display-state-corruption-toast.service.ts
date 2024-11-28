import { inject, Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root',
})
export class DisplayStateCorruptionToastService {
  private messageService = inject(MessageService);

  show(storeName: string) {
    this.messageService.add({
      severity: 'error',
      summary: `${storeName} state is corrupted`,
      detail: "Application won't behave as expected.",
      sticky: true,
    });
  }
}
