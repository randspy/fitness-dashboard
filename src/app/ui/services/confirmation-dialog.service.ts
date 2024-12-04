import { inject, Injectable } from '@angular/core';
import { ConfirmationService } from 'primeng/api';

interface ConfirmationDialogConfig {
  header: string;
  message: string;
  accept?: () => void;
  reject?: () => void;
}

@Injectable()
export class ConfirmationDialogService {
  private confirmationService = inject(ConfirmationService);

  show(config: ConfirmationDialogConfig) {
    this.confirmationService.confirm(config);
  }
}
