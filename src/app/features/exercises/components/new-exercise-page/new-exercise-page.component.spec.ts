import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NewExercisePageComponent } from './new-exercise-page.component';
import { Router, ActivatedRoute } from '@angular/router';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('NewExercisePageComponent', () => {
  let component: NewExercisePageComponent;
  let fixture: ComponentFixture<NewExercisePageComponent>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewExercisePageComponent, NoopAnimationsModule],
      providers: [
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
    fixture = TestBed.createComponent(NewExercisePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate back when cancel is clicked', () => {
    const navigateSpy = jest.spyOn(router, 'navigate');
    const form = fixture.debugElement.query(By.css('fit-exercise-form'));

    form.triggerEventHandler('cancel', null);

    expect(navigateSpy).toHaveBeenCalledWith(['../'], {
      relativeTo: TestBed.inject(ActivatedRoute),
    });
  });

  it('should navigate when form is submitted', () => {
    const navigateSpy = jest.spyOn(router, 'navigate');
    const form = fixture.debugElement.query(By.css('fit-exercise-form'));

    form.triggerEventHandler('save', null);
    expect(navigateSpy).toHaveBeenCalledWith(['../'], {
      relativeTo: TestBed.inject(ActivatedRoute),
    });
  });
});
