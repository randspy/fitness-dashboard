import { TestBed } from '@angular/core/testing';
import { ConfirmationDialogService } from '../app/ui/services/confirmation-dialog.service';
import { ConfirmationDialogComponent } from '../app/ui/components/confirmation-dialog/confirmation-dialog.component';
import { Component } from '@angular/core';
import { mockConfirmationDialogService } from './mock-confirmation-dialog-service';

@Component({
  selector: 'fit-mock-confirmation-dialog',
  template: '<div></div>',
  standalone: true,
})
class MockConfirmationDialogComponent {}

export function applyConfirmationDialogOverrides(testBed: typeof TestBed) {
  return testBed
    .overrideProvider(ConfirmationDialogService, {
      useValue: mockConfirmationDialogService,
    })
    .overrideComponent(ConfirmationDialogComponent, {
      set: {
        selector: 'fit-confirmation-dialog',
        template:
          '<fit-mock-confirmation-dialog></fit-mock-confirmation-dialog>',
        imports: [MockConfirmationDialogComponent],
      },
    });
}
