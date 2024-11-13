import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ExercisePageComponent } from './exercise-page.component';
import { provideRouter } from '@angular/router';
import { HarnessLoader } from '@angular/cdk/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { LinkComponentHarness } from '../../../../../tests/harness/ui/link.harness';

describe('ExercisePageComponent', () => {
  let component: ExercisePageComponent;
  let fixture: ComponentFixture<ExercisePageComponent>;
  let loader: HarnessLoader;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExercisePageComponent, NoopAnimationsModule],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(ExercisePageComponent);
    loader = TestbedHarnessEnvironment.loader(fixture);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a link to the new exercise page', async () => {
    const link = await loader.getHarness(LinkComponentHarness);
    expect(link).toBeTruthy();
    expect(await link.getLink()).toBe('new');
  });

  it('should have a exercise list', () => {
    const exerciseList =
      fixture.nativeElement.querySelector('fit-exercise-list');
    expect(exerciseList).toBeTruthy();
  });
});
