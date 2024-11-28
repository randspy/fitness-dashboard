import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { SettingsPageComponent } from './settings-page.component';
import { UserStore } from '../../../../core/user/store/user.store';
import { provideTestServices } from '../../../../../tests/test-providers';

describe('SettingsPageComponent', () => {
  let component: SettingsPageComponent;
  let fixture: ComponentFixture<SettingsPageComponent>;
  let userStore: InstanceType<typeof UserStore>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SettingsPageComponent],
      providers: [...provideTestServices()],
    }).compileComponents();

    userStore = TestBed.inject(UserStore);

    fixture = TestBed.createComponent(SettingsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    userStore.reset();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should change the user name', () => {
    changeName('John Doe');

    submit();

    const card = fixture.debugElement.query(By.css('fit-card')).nativeElement;
    expect(card.textContent).toContain('John Doe');
    expect(card.textContent).not.toContain('Jane Doe');
    expect(userStore.name()).toBe('John Doe');
    expect(errorMessageElement()).not.toContain('Name is required');
  });

  it('should show an error message if the name is invalid', () => {
    submit();

    expect(errorMessageElement()).toContain('Name is required');
  });

  it('should not show an error on initial load', () => {
    expect(errorMessageElement()).not.toContain('Name is required');
  });

  const nameInputElement = () =>
    fixture.debugElement.query(By.css('[formControlName="name"] input'))
      .nativeElement;

  const errorMessageElement = () =>
    nameInputElement().parentElement?.textContent;

  const formElement = () =>
    fixture.debugElement.query(By.css('form')).nativeElement;

  const submit = () => {
    formElement().dispatchEvent(new Event('submit'));
    fixture.detectChanges();
  };

  const changeName = (name: string) => {
    nameInputElement().value = name;
    nameInputElement().dispatchEvent(new Event('input'));
    fixture.detectChanges();
  };
});
