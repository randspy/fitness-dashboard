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
import { DashboardRoute } from '../../../core/shared/domain/routes.config';
import { SidebarMobileMenuComponent } from '../sidebar-mobile-menu/sidebar-mobile-menu.component';

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
        provideRouter([
          { path: DashboardRoute.slice(1), component: DummyComponent },
        ]),
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
    expect(links[1].nativeElement.innerHTML).toContain('Sessions');
    expect(links[2].nativeElement.innerHTML).toContain('Exercises');
    expect(links[3].nativeElement.innerHTML).toContain('Settings');
  });

  it('should forward items to sidebar-mobile-menu', () => {
    const sidebarMobileMenu = fixture.debugElement.query(
      By.directive(SidebarMobileMenuComponent),
    );
    expect(sidebarMobileMenu.componentInstance.items()).toEqual(
      component.allGroups,
    );
  });
});
