import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MainLayoutComponent } from './main-layout.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { provideRouter } from '@angular/router';
import { By } from '@angular/platform-browser';

describe('MainLayoutComponent', () => {
  let component: MainLayoutComponent;
  let fixture: ComponentFixture<MainLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainLayoutComponent, SidebarComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(MainLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render sidebar', () => {
    const sidebarElement = fixture.debugElement.query(
      By.directive(SidebarComponent),
    );
    expect(sidebarElement).toBeTruthy();
  });

  it('should render router outlet', () => {
    const routerOutletElement = fixture.debugElement.query(
      By.css('router-outlet'),
    );
    expect(routerOutletElement).toBeTruthy();
  });
});
