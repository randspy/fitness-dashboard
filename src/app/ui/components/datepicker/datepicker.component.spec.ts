import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DatepickerComponent } from './datepicker.component';
import {
  FormsModule,
  ReactiveFormsModule,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Component } from '@angular/core';

@Component({
  template: `
    <form [formGroup]="form">
      <fit-datepicker
        [formControl]="dateControl"
        [label]="label"
        [errorMessage]="errorMessage"
        [showError]="showError"
      ></fit-datepicker>
    </form>
  `,
})
class TestComponent {
  dateControl = new FormControl(new Date(), {
    validators: [Validators.required],
  });
  form = new FormGroup({
    dateControl: this.dateControl,
  });
  label = '';
  errorMessage = '';
  showError = false;
}

describe('DatepickerComponent', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        DatepickerComponent,
        FormsModule,
        ReactiveFormsModule,
        NoopAnimationsModule,
      ],
      declarations: [TestComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render label when provided', () => {
    component.label = 'Test Label';

    fixture.detectChanges();

    expect(labelQuery().nativeElement.textContent).toContain('Test Label');
  });

  it('should not render label when not provided', () => {
    component.label = '';

    fixture.detectChanges();

    expect(labelQuery()).toBeNull();
  });

  it('should show error message when showError is true', () => {
    component.showError = true;
    component.errorMessage = 'Error occurred';

    fixture.detectChanges();

    expect(errorQuery().nativeElement.textContent).toContain('Error occurred');
  });

  it('should not show error message when showError is false', () => {
    component.showError = false;
    component.errorMessage = 'Error occurred';

    fixture.detectChanges();

    expect(errorQuery()).toBeNull();
  });

  it('should apply error styling when showError is true', () => {
    component.showError = true;

    fixture.detectChanges();

    expect(datepickerElement().classList.contains('ng-invalid')).toBe(true);
    expect(datepickerElement().classList.contains('ng-dirty')).toBe(true);

    expect(datepickerElement().classList.contains('ng-touched')).toBe(true);
  });

  it('should not apply error styling when showError is false', () => {
    component.showError = false;

    fixture.detectChanges();

    expect(datepickerElement().classList.contains('ng-invalid')).toBe(false);
    expect(datepickerElement().classList.contains('ng-dirty')).toBe(false);
    expect(datepickerElement().classList.contains('ng-touched')).toBe(false);
  });

  it('should validate the form control', () => {
    const date = new Date();
    component.dateControl.setValue(date);
    fixture.detectChanges();

    expect(component.form.valid).toBeTruthy();
  });

  it('should not validate the form control', () => {
    component.dateControl.setValue(null);
    fixture.detectChanges();

    expect(component.form.valid).toBeFalsy();
  });

  it('should update value when date changes', () => {
    const date = new Date('2024-02-01');

    const datepickerElement = fixture.debugElement.query(
      By.css('p-datepicker'),
    );
    datepickerElement.triggerEventHandler('ngModelChange', date);
    fixture.detectChanges();

    expect(component.dateControl.value).toBe(date);
  });

  it('should display a placeholder for en-US', () => {
    Object.defineProperty(navigator, 'language', {
      value: 'en-US',
      configurable: true,
    });

    fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();

    expect(inputElement().getAttribute('placeholder')).toBe('mm/dd/yyyy');
  });

  it('should display a placeholder for default locale', () => {
    Object.defineProperty(navigator, 'language', {
      value: 'default',
      configurable: true,
    });

    fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();

    expect(inputElement().getAttribute('placeholder')).toBe('dd/mm/yyyy');
  });

  const labelQuery = () => {
    return fixture.debugElement.query(By.css('label'));
  };

  const inputElement = () => {
    return fixture.debugElement.query(By.css('input')).nativeElement;
  };

  const errorQuery = () => {
    return fixture.debugElement.query(By.css('p'));
  };

  const datepickerQuery = () => {
    return fixture.debugElement.query(By.css('p-datepicker'));
  };

  const datepickerElement = () => {
    return datepickerQuery().nativeElement;
  };
});
