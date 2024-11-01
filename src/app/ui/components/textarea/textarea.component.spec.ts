import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TextareaComponent } from './textarea.component';
import { FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { FormControl, FormGroup } from '@angular/forms';
import { Component } from '@angular/core';

@Component({
  template: `
    <form [formGroup]="form">
      <fit-textarea
        [formControl]="textareaControl"
        [label]="label"
        [placeholder]="placeholder"
        [errorMessage]="errorMessage"
        [showError]="showError"
        [styleClass]="styleClass"
        [rows]="rows"
      ></fit-textarea>
    </form>
  `,
})
class TestComponent {
  textareaControl = new FormControl('', Validators.required);
  form = new FormGroup({
    textareaControl: this.textareaControl,
  });
  label = '';
  placeholder = '';
  errorMessage = '';
  showError = false;
  styleClass = '';
  rows = 3;
}

describe('TextareaComponent', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let textareaElement: HTMLTextAreaElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        TextareaComponent,
        FormsModule,
        ReactiveFormsModule,
        NoopAnimationsModule,
      ],
      declarations: [TestComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    textareaElement = fixture.debugElement.query(
      By.css('textarea'),
    ).nativeElement;
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

    const textareaElement = fixture.debugElement.query(
      By.css('textarea'),
    ).nativeElement;
    expect(textareaElement.placeholder).toBe('Enter value');
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

  it('should apply error styling to textarea', () => {
    component.showError = true;

    fixture.detectChanges();

    const textareaElement = fixture.debugElement.query(
      By.css('textarea'),
    ).nativeElement;
    expect(textareaElement.classList.contains('ng-invalid')).toBe(true);
    expect(textareaElement.classList.contains('ng-dirty')).toBe(true);
  });

  it('should apply styleClass when provided', () => {
    component.styleClass = 'custom-class';

    fixture.detectChanges();

    const textareaElement = fixture.debugElement.query(
      By.css('textarea'),
    ).nativeElement;
    expect(textareaElement.classList.contains('custom-class')).toBe(true);
  });

  it('should set rows correctly', () => {
    component.rows = 5;

    fixture.detectChanges();

    const textareaElement = fixture.debugElement.query(
      By.css('textarea'),
    ).nativeElement;
    expect(textareaElement.rows).toBe(5);
  });

  it('should not validate the form control', () => {
    textareaElement.value = '';
    textareaElement.dispatchEvent(new Event('input'));

    fixture.detectChanges();

    expect(component.form.valid).toBeFalsy();
  });

  it('should validate the form control', () => {
    textareaElement.value = 'value';
    textareaElement.dispatchEvent(new Event('input'));

    fixture.detectChanges();
    expect(component.form.valid).toBeTruthy();
  });

  it('should change form control value', () => {
    textareaElement.value = 'new value';
    textareaElement.dispatchEvent(new Event('input'));

    fixture.detectChanges();

    expect(component.textareaControl.value).toBe('new value');
  });
});
