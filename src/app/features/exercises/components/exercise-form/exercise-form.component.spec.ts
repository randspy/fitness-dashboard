import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ExerciseFormComponent } from './exercise-form.component';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ConfirmationService } from 'primeng/api';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ButtonComponentHarness } from '../../../../../tests/harness/ui/button.harness';
import { InputComponentHarness } from '../../../../../tests/harness/ui/input.harness';
import { TextareaComponentHarness } from '../../../../../tests/harness/ui/textarea.harness';
import { CardComponentHarness } from '../../../../../tests/harness/ui/card.harness';

describe('ExerciseFormComponent', () => {
  let component: ExerciseFormComponent;
  let fixture: ComponentFixture<ExerciseFormComponent>;
  let loader: HarnessLoader;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExerciseFormComponent, NoopAnimationsModule],
      providers: [ConfirmationService],
    }).compileComponents();

    fixture = TestBed.createComponent(ExerciseFormComponent);
    loader = TestbedHarnessEnvironment.loader(fixture);
    component = fixture.componentInstance;
  });

  describe('new exercise', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should display error message when name is invalid', async () => {
      clickSubmitButton();

      fixture.detectChanges();

      const name = await nameInput();
      expect(await name.isInvalid()).toBeTruthy();
      expect(await name.isTouched()).toBeTruthy();
      expect(await name.getErrorMessage()).toContain('Name is required');
    });

    it('should emit cancel event when cancel button is clicked', async () => {
      const cancelSpy = jest.spyOn(component.cancel, 'emit');

      await clickCancelButton();

      expect(cancelSpy).toHaveBeenCalled();
    });

    it('should save and navigate when form is submitted with valid data', async () => {
      const saveSpy = jest.spyOn(component.save, 'emit');

      await setName('Push-ups');
      await setDescription('Description');

      clickSubmitButton();

      expect(saveSpy).toHaveBeenCalledWith({
        id: expect.any(String),
        name: 'Push-ups',
        description: 'Description',
      });
    });

    describe('canDeactivate', () => {
      it('should return true after form is submitted', async () => {
        await setName('Push-ups');
        clickSubmitButton();

        expect(component.canDeactivate()).toBeTruthy();
      });

      it('should return true when form is pristine', () => {
        expect(component.canDeactivate()).toBeTruthy();
      });

      it('should return true when form is dirty but has not changed', async () => {
        await setName('Push-ups');
        await setName('');
        fixture.detectChanges();

        expect(component.canDeactivate()).toBeTruthy();
      });

      it('should return false when form is dirty and has changed', async () => {
        await setName('Push-ups');
        fixture.detectChanges();

        expect(component.canDeactivate()).toBeFalsy();
      });
    });

    it('should set form header to "Custom Header"', async () => {
      fixture.componentRef.setInput('header', 'Custom Header');
      fixture.detectChanges();

      const card = await loader.getHarness(CardComponentHarness);
      expect(await card.getHeaderText()).toBe('Custom Header');
    });
  });

  describe('edit exercise', () => {
    it('should edit the exercise', async () => {
      const saveSpy = jest.spyOn(component.save, 'emit');

      fixture.componentRef.setInput('exercise', {
        id: '1-2-3-4-5',
        name: 'Chin-ups',
        description: 'Story about chin-ups',
      });

      fixture.detectChanges();

      await fixture.whenStable();

      await setName('Push-ups');
      await setDescription('Story about push-ups');

      clickSubmitButton();

      expect(saveSpy).toHaveBeenCalledWith({
        id: '1-2-3-4-5',
        name: 'Push-ups',
        description: 'Story about push-ups',
      });
    });
  });

  const nameInput = async () => await loader.getHarness(InputComponentHarness);

  const formQuery = () => fixture.debugElement.query(By.css('form'));

  const descriptionInput = async () =>
    await loader.getHarness(TextareaComponentHarness);

  const clickSubmitButton = () => {
    const form = formQuery();
    form.triggerEventHandler('submit', null);
  };

  const cancelButton = async () =>
    await loader.getHarness(
      ButtonComponentHarness.with({
        testId: 'cancel-button',
      }),
    );

  const clickCancelButton = async () => {
    const cancel = await cancelButton();
    await cancel.click();
  };

  const setName = async (value: string) => {
    const name = await nameInput();
    await name.setValue(value);
  };

  const setDescription = async (value: string) => {
    const description = await descriptionInput();
    await description.setValue(value);
  };
});
