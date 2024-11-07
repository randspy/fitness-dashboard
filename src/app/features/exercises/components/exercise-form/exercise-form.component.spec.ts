import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ExerciseFormComponent } from './exercise-form.component';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ConfirmationService } from 'primeng/api';

describe('ExerciseFormComponent', () => {
  let component: ExerciseFormComponent;
  let fixture: ComponentFixture<ExerciseFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExerciseFormComponent, NoopAnimationsModule],
      providers: [ConfirmationService],
    }).compileComponents();

    fixture = TestBed.createComponent(ExerciseFormComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display error message when name is invalid', () => {
    const form = fixture.debugElement.query(By.css('form'));
    form.triggerEventHandler('submit', null);

    fixture.detectChanges();

    expect(nameInputElement().classList.contains('ng-invalid')).toBeTruthy();
    expect(nameInputElement().classList.contains('ng-touched')).toBeTruthy();

    expect(errorMessageElement(nameInputElement().parentElement)).toBe(
      'Name is required',
    );
  });

  it('should emit cancel event when cancel button is clicked', () => {
    const cancelSpy = jest.spyOn(component.cancel, 'emit');
    const cancelButton = fixture.debugElement.query(
      By.css('[data-testid="cancel-button"]'),
    );

    cancelButton.triggerEventHandler('click', null);

    expect(cancelSpy).toHaveBeenCalled();
  });

  it('should save and navigate when form is submitted with valid data', async () => {
    const saveSpy = jest.spyOn(component.save, 'emit');
    const form = fixture.debugElement.query(By.css('form'));

    nameInputElement().value = 'Push-ups';
    nameInputElement().dispatchEvent(new Event('input'));

    descriptionInputElement().value = 'Description';
    descriptionInputElement().dispatchEvent(new Event('input'));

    fixture.detectChanges();

    await fixture.whenStable();

    form.triggerEventHandler('submit', null);

    expect(saveSpy).toHaveBeenCalledWith({
      id: expect.any(String),
      name: 'Push-ups',
      description: 'Description',
    });
  });

  describe('canDeactivate', () => {
    it('should return true when form is pristine', () => {
      expect(component.canDeactivate()).toBeTruthy();
    });

    it('should return true when form is dirty but has not changed', () => {
      nameInputElement().value = '';
      nameInputElement().dispatchEvent(new Event('input'));
      fixture.detectChanges();

      expect(component.canDeactivate()).toBeTruthy();
    });

    it('should return false when form is dirty and has changed', () => {
      nameInputElement().value = 'Push-ups';
      nameInputElement().dispatchEvent(new Event('input'));
      fixture.detectChanges();

      expect(component.canDeactivate()).toBeFalsy();
    });
  });

  it('should keep the state from the initial state if not changed', async () => {
    const saveSpy = jest.spyOn(component.save, 'emit');
    const form = fixture.debugElement.query(By.css('form'));

    fixture.componentRef.setInput('initialState', {
      id: '1-2-3-4-5',
      name: 'Chin-ups',
      description: 'Story about chin-ups',
    });

    fixture.detectChanges();

    nameInputElement().value = 'Push-ups';
    nameInputElement().dispatchEvent(new Event('input'));

    fixture.detectChanges();

    await fixture.whenStable();

    form.triggerEventHandler('submit', null);

    expect(saveSpy).toHaveBeenCalledWith({
      id: '1-2-3-4-5',
      name: 'Push-ups',
      description: 'Story about chin-ups',
    });
  });

  const nameInputElement = () =>
    fixture.debugElement.query(By.css('input.p-inputtext')).nativeElement;

  const descriptionInputElement = () =>
    fixture.debugElement.query(By.css('textarea.p-textarea')).nativeElement;

  const errorMessageElement = (element: HTMLElement) =>
    element.querySelector('.text-error')?.textContent;
});
