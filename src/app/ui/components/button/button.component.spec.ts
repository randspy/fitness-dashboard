import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ButtonComponent } from './button.component';
import { By } from '@angular/platform-browser';
import { Component, viewChild } from '@angular/core';

@Component({
  template: ` <fit-button>Test Button</fit-button> `,
})
class TestComponent {
  child = viewChild<ButtonComponent>(ButtonComponent);
}

describe('ButtonComponent', () => {
  let component: ButtonComponent;
  let fixture: ComponentFixture<ButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ButtonComponent],
      declarations: [TestComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render button with correct label', () => {
    const fixture = TestBed.createComponent(TestComponent);

    const buttonElement = fixture.debugElement.query(By.css('button'));
    expect(buttonElement.nativeElement.textContent.trim()).toBe('Test Button');
  });

  it('should apply styleClass when provided', () => {
    fixture.componentRef.setInput('styleClass', 'custom-class');
    fixture.detectChanges();

    expect(buttonElement().classList.contains('custom-class')).toBe(true);
  });

  it('should set button type correctly', () => {
    fixture.componentRef.setInput('type', 'submit');
    fixture.detectChanges();

    expect(buttonElement().type).toBe('submit');
  });

  it('should disable button when disabled is true', () => {
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();

    expect(buttonElement().disabled).toBe(true);
  });

  it('should enable button when disabled is false', () => {
    fixture.componentRef.setInput('disabled', false);
    fixture.detectChanges();

    expect(buttonElement().disabled).toBe(false);
  });

  it('should emit click event when button is clicked', () => {
    const clickSpy = jest.spyOn(component.onClick, 'emit');

    buttonElement().click();

    expect(clickSpy).toHaveBeenCalled();
  });

  it('should set severity correctly', () => {
    fixture.componentRef.setInput('severity', 'secondary');
    fixture.detectChanges();

    expect(buttonElement().classList.contains('p-button-secondary')).toBe(true);
  });

  it('should render text button when text is true', () => {
    fixture.componentRef.setInput('text', true);
    fixture.detectChanges();

    expect(buttonElement().classList.contains('p-button-text')).toBe(true);
  });

  it('should render raised button when raised is true', () => {
    fixture.componentRef.setInput('raised', true);
    fixture.detectChanges();

    expect(buttonElement().classList.contains('p-button-raised')).toBe(true);
  });

  it('should display aria label when provided', () => {
    fixture.componentRef.setInput('ariaLabel', 'Test aria label');
    fixture.detectChanges();

    expect(buttonElement().getAttribute('aria-label')).toBe('Test aria label');
  });

  const buttonElement = () =>
    fixture.debugElement.query(By.css('button')).nativeElement;
});
