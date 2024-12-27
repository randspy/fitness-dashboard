import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { provideTestServices } from '../tests/test-providers';
import { By } from '@angular/platform-browser';

jest.mock('./app.styles', () => ({
  themeConfig: {},
}));

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [...provideTestServices()],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should render a toast', () => {
    expect(fixture.nativeElement.querySelector('fit-toast')).toBeTruthy();
  });

  it('should render a dialog', () => {
    expect(
      fixture.debugElement.query(By.css('fit-confirmation-dialog')),
    ).toBeTruthy();
  });
});
