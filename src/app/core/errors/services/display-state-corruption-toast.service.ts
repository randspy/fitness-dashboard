import { inject, Injectable } from '@angular/core';
import { ToastService } from '../../../ui/services/toast.service';

@Injectable({
  providedIn: 'root',
})
export class DisplayStateCorruptionToastService {
  private toastService = inject(ToastService);

  show(storeName: string) {
    this.toastService.show({
      severity: 'error',
      summary: `${storeName} state is corrupted`,
      detail: "Application won't behave as expected.",
    });
  }
}
