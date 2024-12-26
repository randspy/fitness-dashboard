import { Router, ActivatedRoute } from '@angular/router';
import { inject, Signal } from '@angular/core';
import { Observable, Observer } from 'rxjs';
import { ConfirmationDialogService } from '../../../../ui/services/confirmation-dialog.service';
import { CanComponentDeactivate } from '../../domain/can-component-deactivate.types';

export abstract class BaseFormPageComponent<T extends CanComponentDeactivate> {
  protected router = inject(Router);
  protected route = inject(ActivatedRoute);
  protected confirmationDialogService = inject(ConfirmationDialogService);
  protected abstract child: Signal<T>;

  navigateToParent() {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  canDeactivate(): Observable<boolean> | boolean {
    if (!this.child().canDeactivate || this.child().canDeactivate!()) {
      return true;
    }

    return new Observable<boolean>((observer: Observer<boolean>) => {
      this.confirmationDialogService.show({
        header: 'You have unsaved changes',
        message: 'Are you sure you want to leave this page?',
        accept: () => {
          observer.next(true);
          observer.complete();
        },
        reject: () => {
          observer.next(false);
          observer.complete();
        },
      });
    });
  }
}
