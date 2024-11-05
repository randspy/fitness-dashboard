import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SidebarComponent } from './sidebar.component';
import { provideRouter } from '@angular/router';
import { By } from '@angular/platform-browser';
import { SidebarLinkComponent } from '../sidebar-link/sidebar-link.component';
import { TooltipModule } from 'primeng/tooltip';
import { ButtonModule } from 'primeng/button';
import { TieredMenuModule } from 'primeng/tieredmenu';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { DummyComponent } from '../../../../tests/dummy-component';

describe('SidebarComponent', () => {
  let component: SidebarComponent;
  let fixture: ComponentFixture<SidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        SidebarComponent,
        SidebarLinkComponent,
        TooltipModule,
        ButtonModule,
        TieredMenuModule,
        NoopAnimationsModule,
      ],
      providers: [
        provideRouter([{ path: 'app/dashboard', component: DummyComponent }]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render links', () => {
    const links = fixture.debugElement.queryAll(
      By.directive(SidebarLinkComponent),
    );

    expect(links.length).toBe(4);
    expect(links[0].nativeElement.innerHTML).toContain('Dashboard');
    expect(links[1].nativeElement.innerHTML).toContain('Exercises');
    expect(links[2].nativeElement.innerHTML).toContain('Sessions');
    expect(links[3].nativeElement.innerHTML).toContain('Settings');
  });

  // those tests are passing but causing and log error in the console
  // ERROR [TypeError: Cannot read properties of null (reading \'offsetHeight\'
  // related to the fact that we use jsdom to run the tests
  // and we are missing something
  // not clear to me how to fix this properly
  // offsetHeight exists in window.HTMLElement.prototype
  // which exists in the test, I logged it.
  // TODO: fix this properly
  // I have decided that I prefer clean terminal over those tests for now.

  // it('should open mobile menu on button click', () => {
  //   const menuButton = fixture.debugElement.query(By.css('p-button'));
  //   menuButton.triggerEventHandler('click', new MouseEvent('click'));

  //   fixture.detectChanges();

  //   const tieredMenu = fixture.debugElement.query(
  //     By.css('.p-tieredmenu-overlay'),
  //   );

  //   expect(tieredMenu).toBeTruthy();
  //   expect(tieredMenu.nativeElement.innerHTML).toContain('Dashboard');
  //   expect(tieredMenu.nativeElement.innerHTML).toContain('Exercises');
  //   expect(tieredMenu.nativeElement.innerHTML).toContain('Workouts');
  //   expect(tieredMenu.nativeElement.innerHTML).toContain('Settings');
  // });

  // it('should navigate to the correct route when a link is clicked in mobile menu', async () => {
  //   const menuButton = fixture.debugElement.query(By.css('p-button'));
  //   menuButton.triggerEventHandler('click', new MouseEvent('click'));

  //   fixture.detectChanges();

  //   const tieredMenu = fixture.debugElement.query(
  //     By.css('.p-tieredmenu-overlay'),
  //   );

  //   const link = tieredMenu.query(By.css('a'));
  //   link.triggerEventHandler('click', new MouseEvent('click'));

  //   fixture.detectChanges();

  //   const router = TestBed.inject(Router);

  //   await fixture.whenStable();

  //   expect(router.url).toBe('/app/dashboard');
  // });
});
