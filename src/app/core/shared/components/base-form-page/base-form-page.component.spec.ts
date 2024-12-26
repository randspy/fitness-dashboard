import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { BaseFormPageComponent } from './base-form-page.component';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ConfirmationDialogService } from '../../../../ui/services/confirmation-dialog.service';
import { mockConfirmationDialogService } from '../../../../../tests/mock-confirmation-dialog-service';
import { CanComponentDeactivate } from '../../domain/can-component-deactivate.types';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule],
  providers: [
    {
      provide: ConfirmationDialogService,
      useValue: mockConfirmationDialogService,
    },
  ],
  template: `
    <form [formGroup]="form" (ngSubmit)="onSubmit()">
      <button type="submit">Submit</button>
      <button type="button" (click)="onCancel()">Cancel</button>
    </form>
  `,
})
class TestFormPageComponent extends BaseFormPageComponent<CanComponentDeactivate> {
  formBuilder = inject(FormBuilder);
  form = this.formBuilder.group({
    testField: [''],
  });

  child = signal<CanComponentDeactivate>({
    canDeactivate: () => true,
  });
}

describe('BaseFormComponent', () => {
  let component: TestFormPageComponent;
  let fixture: ComponentFixture<TestFormPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        NoopAnimationsModule,
        TestFormPageComponent,
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              url: [{ path: 'app' }, { path: 'feature' }, { path: 'test' }],
            },
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TestFormPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to parent', () => {
    const router = TestBed.inject(Router);
    const navigateSpy = jest.spyOn(router, 'navigate');

    component.navigateToParent();

    expect(navigateSpy).toHaveBeenCalledWith(['../'], {
      relativeTo: TestBed.inject(ActivatedRoute),
    });
  });

  it('should pass through canDeactivate when true', () => {
    component.child.set({ canDeactivate: () => true });
    expect(component.canDeactivate()).toBe(true);
  });

  it('should return true when canDeactivate is not defined', () => {
    component.child.set({ canDeactivate: undefined });
    expect(component.canDeactivate()).toBe(true);
  });

  it('should return an observable that emits true when confirm is accepted', fakeAsync(() => {
    component.child.set({ canDeactivate: () => false });

    let result: boolean | undefined;
    (component.canDeactivate() as Observable<boolean>).subscribe((value) => {
      result = value;
    });

    const confirmOptions = (mockConfirmationDialogService.show as jest.Mock)
      .mock.calls[0][0];
    confirmOptions.accept?.();

    tick();

    expect(mockConfirmationDialogService.show).toHaveBeenCalledWith({
      header: 'You have unsaved changes',
      message: 'Are you sure you want to leave this page?',
      accept: expect.any(Function),
      reject: expect.any(Function),
    });
    expect(result).toBe(true);
  }));

  it('should return an observable that emits false when confirm is rejected', fakeAsync(() => {
    component.child.set({ canDeactivate: () => false });

    let result: boolean | undefined;
    (component.canDeactivate() as Observable<boolean>).subscribe((value) => {
      result = value;
    });

    const confirmOptions = (mockConfirmationDialogService.show as jest.Mock)
      .mock.calls[0][0];
    confirmOptions.reject?.();

    tick();

    expect(mockConfirmationDialogService.show).toHaveBeenCalledWith({
      header: 'You have unsaved changes',
      message: 'Are you sure you want to leave this page?',
      accept: expect.any(Function),
      reject: expect.any(Function),
    });
    expect(result).toBe(false);
  }));
});
