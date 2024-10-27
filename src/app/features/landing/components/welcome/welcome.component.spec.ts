import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WelcomeComponent } from './welcome.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CardComponent } from '../../../../ui/components/card/card.component';
import { InputComponent } from '../../../../ui/components/input/input.component';
import { ButtonComponent } from '../../../../ui/components/button/button.component';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('WelcomeComponent', () => {
  let component: WelcomeComponent;
  let fixture: ComponentFixture<WelcomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        WelcomeComponent,
        ReactiveFormsModule,
        CardComponent,
        InputComponent,
        ButtonComponent,
        NoopAnimationsModule,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(WelcomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the correct title', () => {
    const titleElement = fixture.debugElement.query(By.css('h1'));
    expect(titleElement.nativeElement.textContent).toContain('Hello');
  });

  it('should render the input component', () => {
    const inputElement = fixture.debugElement.query(
      By.directive(InputComponent),
    );
    expect(inputElement).toBeTruthy();
  });

  it('should render the button component', () => {
    const buttonElement = fixture.debugElement.query(
      By.directive(ButtonComponent),
    );
    expect(buttonElement).toBeTruthy();
  });

  it('should disable submit button when form is empty', () => {
    const buttonElement = fixture.debugElement.query(
      By.directive(ButtonComponent),
    );
    expect(buttonElement.componentInstance.disabled).toBeTruthy();
  });

  it('should enable submit button when name is provided', () => {
    const inputElement = fixture.debugElement.query(
      By.directive(InputComponent),
    );
    inputElement.componentInstance.onInput('John Doe');
    fixture.detectChanges();

    const buttonElement = fixture.debugElement.query(
      By.directive(ButtonComponent),
    );
    expect(buttonElement.componentInstance.disabled()).toBeFalsy();
  });

  it('should not show error message when name is valid', () => {
    const inputElement = fixture.debugElement.query(
      By.directive(InputComponent),
    );
    inputElement.componentInstance.onInput('John Doe');
    fixture.detectChanges();

    expect(inputElement.componentInstance.showError()).toBeFalsy();
    expect(inputElement.componentInstance.errorMessage()).toBe('');
  });

  it('should show error message when name is touched, dirty and empty', () => {
    const inputElement = fixture.debugElement.query(
      By.directive(InputComponent),
    );

    inputElement.componentInstance.onInput('John Doe');
    inputElement.componentInstance.onInput('');
    fixture.detectChanges();

    expect(inputElement.componentInstance.showError()).toBeTruthy();
    expect(inputElement.componentInstance.errorMessage()).toBe(
      'Name is required',
    );
  });

  it('should log form value when submitted with valid data', () => {
    const consoleSpy = jest.spyOn(console, 'log');
    const inputElement = fixture.debugElement.query(
      By.directive(InputComponent),
    );
    inputElement.componentInstance.onInput('John Doe');
    fixture.detectChanges();

    const form = fixture.debugElement.query(By.css('form'));
    form.triggerEventHandler('submit', null);

    expect(consoleSpy).toHaveBeenCalledWith({ name: 'John Doe' });
  });
});
