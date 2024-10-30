import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewExercisePageComponent } from './new-exercise-page.component';

describe('NewExercisePageComponent', () => {
  let component: NewExercisePageComponent;
  let fixture: ComponentFixture<NewExercisePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewExercisePageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NewExercisePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
