import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExercisePageComponent } from './exercise-page.component';
import { provideRouter } from '@angular/router';

describe('ExercisePageComponent', () => {
  let component: ExercisePageComponent;
  let fixture: ComponentFixture<ExercisePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExercisePageComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(ExercisePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a link to the new exercise page', () => {
    const link = fixture.nativeElement.querySelector('fit-link');
    expect(link).toBeTruthy();
    expect(link.getAttribute('link')).toBe('new');
  });

  it('should have a exercise list', () => {
    const exerciseList =
      fixture.nativeElement.querySelector('fit-exercise-list');
    expect(exerciseList).toBeTruthy();
  });
});
