import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WelcomeComponent } from './welcome.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CardComponent } from '../../../../ui/components/card/card.component';
import { InputComponent } from '../../../../ui/components/input/input.component';
import { ButtonComponent } from '../../../../ui/components/button/button.component';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { UserStore } from '../../../../core/user/store/user.store';

import { Router, provideRouter } from '@angular/router';
import { DummyComponent } from '../../../../../tests/dummy-component';
import { provideTestLogger } from '../../../../../tests/provide-test-logger';

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
        provideRouter([{ path: 'app/dashboard', component: DummyComponent }]),
        provideTestLogger(),
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
    expect(inputQuery()).toBeTruthy();
  });

  it('should render the button component', () => {
    expect(buttonQuery()).toBeTruthy();
  });

  it('should enable submit button when name is provided', () => {
    const input = inputInstance();
    input.onInput('John Doe');
    fixture.detectChanges();

    expect(buttonInstance().disabled()).toBeFalsy();
  });

  it('should not show error message when name is valid', () => {
    const input = inputInstance();
    input.onInput('John Doe');

    submitForm();

    expect(errorMessageElement(inputElement())).toBeFalsy();
  });

  it('should show error message when name is empty', () => {
    submitForm();

    fixture.detectChanges();
    expect(errorMessageElement(inputElement())).toBe('Name is required');
  });

  it('should set user name when submitted with valid data', () => {
    const input = inputInstance();
    input.onInput('John Doe');
    fixture.detectChanges();

    submitForm();

    expect(userStore.name()).toBe('John Doe');
  });

  it('should navigate to dashboard when submitted with valid data', async () => {
    const input = inputInstance();
    input.onInput('John Doe');
    fixture.detectChanges();

    submitForm();

    fixture.detectChanges();

    await fixture.whenStable();

    expect(router.url).toEqual('/app/dashboard');
  });

  function buttonQuery() {
    return fixture.debugElement.query(By.directive(ButtonComponent));
  }

  function buttonInstance() {
    return buttonQuery().componentInstance;
  }

  function inputQuery() {
    return fixture.debugElement.query(By.directive(InputComponent));
  }

  function inputInstance() {
    return inputQuery().componentInstance;
  }

  function inputElement() {
    return inputQuery().nativeElement;
  }

  function formQuery() {
    return fixture.debugElement.query(By.css('form'));
  }

  const errorMessageElement = (element: HTMLElement) =>
    element.querySelector('.text-error')?.textContent;

  const submitForm = () => formQuery().triggerEventHandler('submit', null);
});
