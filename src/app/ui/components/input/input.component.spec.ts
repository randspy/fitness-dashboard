import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InputComponent } from './input.component';
import { FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { FormControl, FormGroup } from '@angular/forms';
import { Component } from '@angular/core';

@Component({
  template: `
    <form [formGroup]="form">
      <fit-input
        [formControl]="inputControl"
        [label]="label"
        [placeholder]="placeholder"
        [errorMessage]="errorMessage"
        [showError]="showError"
        [styleClass]="styleClass"
        [type]="type"
      ></fit-input>
    </form>
  `,
})
class TestComponent {
  inputControl = new FormControl('', Validators.required);
  form = new FormGroup({
    inputControl: this.inputControl,
  });
  label = '';
  placeholder = '';
  errorMessage = '';
  showError = false;
  styleClass = '';
  type = 'text';
}

describe('InputComponent', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let inputElement: HTMLInputElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        InputComponent,
        FormsModule,
        ReactiveFormsModule,
        NoopAnimationsModule,
      ],
      declarations: [TestComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    inputElement = fixture.debugElement.query(By.css('input')).nativeElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render label when provided', () => {
    component.label = 'Test Label';

    fixture.detectChanges();

    const labelElement = fixture.debugElement.query(By.css('label'));
    expect(labelElement.nativeElement.textContent).toContain('Test Label');
  });

  it('should not render label when not provided', () => {
    component.label = '';

    fixture.detectChanges();

    const labelElement = fixture.debugElement.query(By.css('label'));
    expect(labelElement).toBeNull();
  });

  it('should set placeholder correctly', () => {
    component.placeholder = 'Enter value';

    fixture.detectChanges();

    expect(inputElement.placeholder).toBe('Enter value');
  });

  it('should show error message when showError is true', () => {
    component.showError = true;
    component.errorMessage = 'Error occurred';

    fixture.detectChanges();

    const errorElement = fixture.debugElement.query(By.css('p'));
    expect(errorElement.nativeElement.textContent).toContain('Error occurred');
  });

  it('should not show error message when showError is false', () => {
    component.showError = false;
    component.errorMessage = 'Error occurred';

    fixture.detectChanges();

    const errorElement = fixture.debugElement.query(By.css('p'));
    expect(errorElement).toBeNull();
  });

  it('should apply error styling to input', () => {
    component.showError = true;

    fixture.detectChanges();

    expect(inputElement.classList.contains('ng-invalid')).toBe(true);
    expect(inputElement.classList.contains('ng-dirty')).toBe(true);
  });

  it('should apply styleClass when provided', () => {
    component.styleClass = 'custom-class';

    fixture.detectChanges();

    expect(inputElement.classList.contains('custom-class')).toBe(true);
  });

  it('should set type correctly', () => {
    component.type = 'password';

    fixture.detectChanges();

    expect(inputElement.type).toBe('password');
  });

  it('should not validate the form control', () => {
    inputElement.value = '';
    inputElement.dispatchEvent(new Event('input'));

    fixture.detectChanges();

    expect(component.form.valid).toBeFalsy();
  });

  it('should validate the form control', () => {
    inputElement.value = 'value';
    inputElement.dispatchEvent(new Event('input'));

    fixture.detectChanges();

    expect(component.form.valid).toBeTruthy();
  });

  it('should change form control value', () => {
    inputElement.value = 'new value';
    inputElement.dispatchEvent(new Event('input'));

    fixture.detectChanges();

    expect(component.inputControl.value).toBe('new value');
  });
});
