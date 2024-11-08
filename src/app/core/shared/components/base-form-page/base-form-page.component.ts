import { Router, ActivatedRoute } from '@angular/router';
import { inject, Signal } from '@angular/core';
import { Observable, Observer } from 'rxjs';
import { ConfirmationService } from 'primeng/api';

export abstract class BaseFormPageComponent<
  T extends { canDeactivate: () => boolean },
> {
  protected router = inject(Router);
  protected route = inject(ActivatedRoute);
  protected confirmationService = inject(ConfirmationService);
  protected abstract child: Signal<T>;

  navigateToParent() {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  canDeactivate(): Observable<boolean> | boolean {
    if (this.child().canDeactivate()) {
      return true;
    }

    return new Observable<boolean>((observer: Observer<boolean>) => {
      this.confirmationService.confirm({
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
