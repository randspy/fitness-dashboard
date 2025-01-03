import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ExercisePageComponent } from './exercise-page.component';
import { provideRouter } from '@angular/router';
import { HarnessLoader } from '@angular/cdk/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { LinkComponentHarness } from '../../../../../tests/harness/ui/link.harness';
import { provideTestServices } from '../../../../../tests/test-providers';
import { applyConfirmationDialogOverrides } from '../../../../../tests/apply-confirmation-dialog-overrides';
import { ExerciseStoreService } from '../../services/exercise-store.service';

describe('ExercisePageComponent', () => {
  let component: ExercisePageComponent;
  let fixture: ComponentFixture<ExercisePageComponent>;
  let loader: HarnessLoader;

  beforeEach(async () => {
    await applyConfirmationDialogOverrides(TestBed)
      .configureTestingModule({
        imports: [ExercisePageComponent, NoopAnimationsModule],
        providers: [
          ExerciseStoreService,
          provideRouter([]),
          ...provideTestServices(),
        ],
      })
      .compileComponents();

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
    expect(await link.getLink()).toBe('/new');
  });

  it('should have a exercise list', () => {
    const exerciseList =
      fixture.nativeElement.querySelector('fit-exercise-list');
    expect(exerciseList).toBeTruthy();
  });
});
