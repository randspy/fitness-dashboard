import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { provideTestServices } from '../tests/test-providers';

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

  it('should render toast', () => {
    expect(fixture.nativeElement.querySelector('fit-toast')).toBeTruthy();
  });
});
