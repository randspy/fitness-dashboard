import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TextareaComponent } from './textarea.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('TextareaComponent', () => {
  let component: TextareaComponent;
  let fixture: ComponentFixture<TextareaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        TextareaComponent,
        FormsModule,
        ReactiveFormsModule,
        NoopAnimationsModule,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TextareaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render label when provided', () => {
    fixture.componentRef.setInput('label', 'Test Label');

    fixture.detectChanges();

    const labelElement = fixture.debugElement.query(By.css('label'));
    expect(labelElement.nativeElement.textContent).toContain('Test Label');
  });

  it('should not render label when not provided', () => {
    fixture.componentRef.setInput('label', '');

    fixture.detectChanges();

    const labelElement = fixture.debugElement.query(By.css('label'));
    expect(labelElement).toBeNull();
  });

  it('should set placeholder correctly', () => {
    fixture.componentRef.setInput('placeholder', 'Enter value');

    fixture.detectChanges();

    const textareaElement = fixture.debugElement.query(
      By.css('textarea'),
    ).nativeElement;
    expect(textareaElement.placeholder).toBe('Enter value');
  });

  it('should show error message when showError is true', () => {
    fixture.componentRef.setInput('showError', true);
    fixture.componentRef.setInput('errorMessage', 'Error occurred');

    fixture.detectChanges();

    const errorElement = fixture.debugElement.query(By.css('p'));
    expect(errorElement.nativeElement.textContent).toContain('Error occurred');
  });

  it('should not show error message when showError is false', () => {
    fixture.componentRef.setInput('showError', false);
    fixture.componentRef.setInput('errorMessage', 'Error occurred');

    fixture.detectChanges();

    const errorElement = fixture.debugElement.query(By.css('p'));
    expect(errorElement).toBeNull();
  });

  it('should call onChange and onTouched when textarea value changes', () => {
    const onChangeSpy = jest.spyOn(component, 'onChange');
    const onTouchedSpy = jest.spyOn(component, 'onTouched');
    const textareaElement = fixture.debugElement.query(
      By.css('textarea'),
    ).nativeElement;

    textareaElement.value = 'New Value';
    textareaElement.dispatchEvent(new Event('input'));

    expect(onChangeSpy).toHaveBeenCalledWith('New Value');
    expect(onTouchedSpy).toHaveBeenCalled();
  });

  it('should update value when writeValue is called', () => {
    component.writeValue('Test Value');

    expect(component.value()).toBe('Test Value');
  });

  it('should set disabled state to true', () => {
    component.setDisabledState(true);

    expect(component.disabled()).toBe(true);
  });

  it('should set disabled state to false', () => {
    component.setDisabledState(false);

    expect(component.disabled()).toBe(false);
  });

  it('should apply styleClass when provided', () => {
    fixture.componentRef.setInput('styleClass', 'custom-class');

    fixture.detectChanges();

    const textareaElement = fixture.debugElement.query(
      By.css('textarea'),
    ).nativeElement;
    expect(textareaElement.classList.contains('custom-class')).toBe(true);
  });

  it('should set rows correctly', () => {
    fixture.componentRef.setInput('rows', 5);

    fixture.detectChanges();

    const textareaElement = fixture.debugElement.query(
      By.css('textarea'),
    ).nativeElement;
    expect(textareaElement.rows).toBe(5);
  });
});
