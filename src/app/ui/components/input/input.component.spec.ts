import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InputComponent } from './input.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

describe('InputComponent', () => {
  let component: InputComponent;
  let fixture: ComponentFixture<InputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputComponent, FormsModule, ReactiveFormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(InputComponent);
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

  it('should set input type correctly', () => {
    fixture.componentRef.setInput('type', 'password');

    fixture.detectChanges();

    const inputElement = fixture.debugElement.query(
      By.css('input'),
    ).nativeElement;
    expect(inputElement.type).toBe('password');
  });

  it('should set placeholder correctly', () => {
    fixture.componentRef.setInput('placeholder', 'Enter value');

    fixture.detectChanges();

    const inputElement = fixture.debugElement.query(
      By.css('input'),
    ).nativeElement;
    expect(inputElement.placeholder).toBe('Enter value');
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

  it('should call onChange and onTouched when input value changes', () => {
    const onChangeSpy = jest.spyOn(component, 'onChange');
    const onTouchedSpy = jest.spyOn(component, 'onTouched');
    const inputElement = fixture.debugElement.query(
      By.css('input'),
    ).nativeElement;

    inputElement.value = 'New Value';
    inputElement.dispatchEvent(new Event('input'));

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

    const inputElement = fixture.debugElement.query(
      By.css('input'),
    ).nativeElement;
    expect(inputElement.classList.contains('custom-class')).toBe(true);
  });
});
