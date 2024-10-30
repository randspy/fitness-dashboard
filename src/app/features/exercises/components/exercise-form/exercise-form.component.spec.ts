import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ExerciseFormComponent } from './exercise-form.component';
import { provideRouter, Router, ActivatedRoute } from '@angular/router';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('ExerciseFormComponent', () => {
  let component: ExerciseFormComponent;
  let fixture: ComponentFixture<ExerciseFormComponent>;
  let router: Router;
  let route: ActivatedRoute;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExerciseFormComponent, NoopAnimationsModule],
      providers: [
        provideRouter([
          {
            path: 'app/exercises',
            component: ExerciseFormComponent,
          },
        ]),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              url: [{ path: 'app' }, { path: 'exercises' }, { path: 'new' }],
            },
          },
        },
      ],
    }).compileComponents();

    router = TestBed.inject(Router);
    route = TestBed.inject(ActivatedRoute);
    fixture = TestBed.createComponent(ExerciseFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show error message when input is dirty and empty', () => {
    const input = fixture.debugElement.query(By.css('fit-input'));

    input.componentInstance.onInput('Push-ups');
    fixture.detectChanges();

    input.componentInstance.onInput('');
    fixture.detectChanges();

    expect(input.componentInstance.showError()).toBeTruthy();
    expect(input.componentInstance.errorMessage()).toBe('Name is required');
  });

  it('should enable save button when form is filled correctly', () => {
    const input = fixture.debugElement.query(By.css('fit-input'));
    const saveButton = fixture.debugElement.query(
      By.css('button[type="submit"]'),
    );

    input.componentInstance.onInput('Push-ups');
    fixture.detectChanges();

    expect(saveButton.properties['disabled']).toBeFalsy();
  });

  it('should navigate back when cancel is clicked', () => {
    const navigateSpy = jest.spyOn(router, 'navigate');
    const cancelButton = fixture.debugElement.query(
      By.css('[data-testid="cancel-button"]'),
    );

    cancelButton.triggerEventHandler('click', null);

    expect(navigateSpy).toHaveBeenCalledWith(['../'], { relativeTo: route });
  });

  it('should save and navigate when form is submitted with valid data', () => {
    const navigateSpy = jest.spyOn(router, 'navigate');
    const input = fixture.debugElement.query(By.css('fit-input'));
    const form = fixture.debugElement.query(By.css('form'));

    input.componentInstance.onInput('Push-ups');
    fixture.detectChanges();

    form.triggerEventHandler('submit', null);

    expect(navigateSpy).toHaveBeenCalledWith(['../'], { relativeTo: route });
  });

  it('should not navigate when form is submitted with invalid data', () => {
    const navigateSpy = jest.spyOn(router, 'navigate');
    const input = fixture.debugElement.query(By.css('fit-input'));
    const form = fixture.debugElement.query(By.css('form'));

    input.componentInstance.onInput('');
    fixture.detectChanges();

    form.triggerEventHandler('submit', null);

    expect(navigateSpy).not.toHaveBeenCalled();
  });
});
