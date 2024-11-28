import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { provideTestServices } from '../tests/test-providers';

jest.mock('./app.styles', () => ({
  themeConfig: {},
}));

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [...provideTestServices()],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have the 'fitness-dashboard' title`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('fitness-dashboard');
  });
});
