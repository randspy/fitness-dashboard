import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@Component({
  selector: 'fit-confirmation-dialog',
  standalone: true,
  imports: [ConfirmDialogModule],
  templateUrl: './confirmation-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmationDialogComponent {}
