import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SidebarComponent } from './sidebar.component';
import { provideRouter, Router } from '@angular/router';
import { By } from '@angular/platform-browser';
import { SidebarLinkComponent } from '../sidebar-link/sidebar-link.component';
import { TooltipModule } from 'primeng/tooltip';
import { ButtonModule } from 'primeng/button';
import { TieredMenuModule } from 'primeng/tieredmenu';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { DummyComponent } from '../../../../tests/dummy-component';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ButtonComponentHarness } from '../../../../tests/harness/ui/button.harness';

describe('SidebarComponent', () => {
  let component: SidebarComponent;
  let fixture: ComponentFixture<SidebarComponent>;
  let loader: HarnessLoader;

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
    loader = TestbedHarnessEnvironment.loader(fixture);
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
    expect(links[1].nativeElement.innerHTML).toContain('Sessions');
    expect(links[2].nativeElement.innerHTML).toContain('Exercises');
    expect(links[3].nativeElement.innerHTML).toContain('Settings');
  });

  it('should open mobile menu on button click', async () => {
    const menuButton = await loader.getHarness(ButtonComponentHarness);
    await menuButton.click();

    fixture.detectChanges();

    const tieredMenu = fixture.debugElement.query(
      By.css('.p-tieredmenu-overlay'),
    );

    expect(tieredMenu).toBeTruthy();
    expect(tieredMenu.nativeElement.innerHTML).toContain('Dashboard');
    expect(tieredMenu.nativeElement.innerHTML).toContain('Exercises');
    expect(tieredMenu.nativeElement.innerHTML).toContain('Sessions');
    expect(tieredMenu.nativeElement.innerHTML).toContain('Settings');
  });

  it('should have aria-label attribute for menu button', async () => {
    const menuButton = await loader.getHarness(ButtonComponentHarness);

    expect(await menuButton.getAriaLabel()).toBe('Sidebar menu');
  });

  it('should navigate to the correct route when a link is clicked in mobile menu', async () => {
    const menuButton = await loader.getHarness(ButtonComponentHarness);
    await menuButton.click();

    fixture.detectChanges();

    const tieredMenu = fixture.debugElement.query(
      By.css('.p-tieredmenu-overlay'),
    );

    const link = tieredMenu.query(By.css('a'));
    link.triggerEventHandler('click', new MouseEvent('click'));

    fixture.detectChanges();

    const router = TestBed.inject(Router);

    await fixture.whenStable();

    expect(router.url).toBe('/app/dashboard');
  });
});
