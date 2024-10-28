import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WelcomeComponent } from './welcome.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CardComponent } from '../../../../ui/components/card/card.component';
import { InputComponent } from '../../../../ui/components/input/input.component';
import { ButtonComponent } from '../../../../ui/components/button/button.component';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { UserStore } from '../../../../core/user/user.store';

import { Router, provideRouter } from '@angular/router';
import { Component } from '@angular/core';

@Component({
  selector: 'fit-dummy',
  template: '',
})
class DummyComponent {}

describe('WelcomeComponent', () => {
  let component: WelcomeComponent;
  let fixture: ComponentFixture<WelcomeComponent>;
  let userStore: InstanceType<typeof UserStore>;
  let router: Router;

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
      providers: [
        UserStore,
        provideRouter([{ path: 'dashboard', component: DummyComponent }]),
      ],
    }).compileComponents();

    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(WelcomeComponent);
    component = fixture.componentInstance;

    userStore = TestBed.inject(UserStore);
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
    const inputElement = getInputElement();
    expect(inputElement).toBeTruthy();
  });

  it('should render the button component', () => {
    const buttonElement = getButtonElement();
    expect(buttonElement).toBeTruthy();
  });

  it('should disable submit button when form is empty', () => {
    const button = getButtonInstance();
    expect(button.disabled()).toBeTruthy();
  });

  it('should enable submit button when name is provided', () => {
    const input = getInputInstance();
    input.onInput('John Doe');
    fixture.detectChanges();

    const button = getButtonInstance();
    expect(button.disabled()).toBeFalsy();
  });

  it('should not show error message when name is valid', () => {
    const input = getInputInstance();
    input.onInput('John Doe');
    fixture.detectChanges();

    expect(input.showError()).toBeFalsy();
    expect(input.errorMessage()).toBe('');
  });

  it('should show error message when name is touched, dirty and empty', () => {
    const input = getInputInstance();

    input.onInput('John Doe');
    input.onInput('');
    fixture.detectChanges();

    expect(input.showError()).toBeTruthy();
    expect(input.errorMessage()).toBe('Name is required');
  });

  it('should set user name when submitted with valid data', () => {
    const input = getInputInstance();
    input.onInput('John Doe');
    fixture.detectChanges();

    const form = getFormElement();
    form.triggerEventHandler('submit', null);

    expect(userStore.name()).toBe('John Doe');
  });

  it('should navigate to dashboard when submitted with valid data', async () => {
    const input = getInputInstance();
    input.onInput('John Doe');
    fixture.detectChanges();

    const form = getFormElement();
    form.triggerEventHandler('submit', null);

    fixture.detectChanges();

    await fixture.whenStable();

    expect(router.url).toEqual('/dashboard');
  });

  function getButtonElement() {
    return fixture.debugElement.query(By.directive(ButtonComponent));
  }

  function getButtonInstance() {
    return getButtonElement().componentInstance;
  }

  function getInputElement() {
    return fixture.debugElement.query(By.directive(InputComponent));
  }

  function getInputInstance() {
    return getInputElement().componentInstance;
  }

  function getFormElement() {
    return fixture.debugElement.query(By.css('form'));
  }
});
