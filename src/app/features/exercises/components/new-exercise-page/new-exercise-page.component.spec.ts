import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewExercisePageComponent } from './new-exercise-page.component';
import { provideRouter } from '@angular/router';

describe('NewExercisePageComponent', () => {
  let component: NewExercisePageComponent;
  let fixture: ComponentFixture<NewExercisePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewExercisePageComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(NewExercisePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
