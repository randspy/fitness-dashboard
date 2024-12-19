import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { HarnessLoader } from '@angular/cdk/testing';
import { SidebarMobileMenuComponent } from './sidebar-mobile-menu.component';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ButtonComponentHarness } from '../../../../tests/harness/ui/button.harness';
import { By } from '@angular/platform-browser';
import { SidebarMobileMenuDropdownComponent } from '../sidebar-mobile-menu-dropdown/sidebar-mobile-menu-dropdown.component';
import { provideRouter } from '@angular/router';
import { Component } from '@angular/core';
import { SidebarLinkItem } from '../../domain/sidebar-link-item.types';
import { signal } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import { lucideHouse } from '@ng-icons/lucide';

describe('SidebarMobileMenuComponent', () => {
  let component: SidebarMobileMenuComponent;
  let fixture: ComponentFixture<SidebarMobileMenuComponent>;
  let loader: HarnessLoader;
  let linkItems: SidebarLinkItem[];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SidebarMobileMenuComponent],
      providers: [provideRouter([]), provideIcons({ lucideHouse })],
    }).compileComponents();

    linkItems = [
      {
        label: 'Home',
        icon: 'lucideHouse',
        routerLink: '/',
      },
    ];

    fixture = TestBed.createComponent(SidebarMobileMenuComponent);
    loader = TestbedHarnessEnvironment.loader(fixture);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('items', linkItems);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle the visible state when the button is clicked', async () => {
    const button = await loader.getHarness(ButtonComponentHarness);
    await button.click();

    const dropdown = fixture.debugElement.query(
      By.directive(SidebarMobileMenuDropdownComponent),
    );
    expect(dropdown).toBeTruthy();
    expect(dropdown.componentInstance.items()).toEqual(linkItems);
    expect(dropdown.componentInstance.visible()).toBe(true);
  });

  it('should not propagate click event', fakeAsync(() => {
    // as in sidebar-mobile-menu-dropdown will listen to document click and would close the menu otherwise
    // fakeAsync was needed to properly handle the event propagation, as it doesn't work with async

    @Component({
      template: `
        <button (click)="clicked = true">
          <fit-sidebar-mobile-menu [items]="items()"></fit-sidebar-mobile-menu>
        </button>
      `,
      standalone: true,
      imports: [SidebarMobileMenuComponent],
    })
    class TestHostComponent {
      items = signal<SidebarLinkItem[]>(linkItems);
      clicked = false;
    }

    const testHost = TestBed.createComponent(TestHostComponent);
    testHost.detectChanges();

    const loader = TestbedHarnessEnvironment.loader(testHost);
    loader.getHarness(ButtonComponentHarness).then((button) => {
      button.click();
    });
    tick();
    testHost.detectChanges();

    expect(testHost.componentInstance.clicked).toBe(false);
  }));
});
