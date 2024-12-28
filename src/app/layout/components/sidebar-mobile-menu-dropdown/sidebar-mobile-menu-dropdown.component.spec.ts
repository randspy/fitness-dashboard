import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarMobileMenuDropdownComponent } from './sidebar-mobile-menu-dropdown.component';
import { provideRouter } from '@angular/router';

import { Component } from '@angular/core';
import { signal } from '@angular/core';
import { SidebarLinkItem } from '../../domain/sidebar-link-item.types';
import { By } from '@angular/platform-browser';

@Component({
  selector: 'fit-sidebar-mobile-menu-dropdown-test',
  template: `<fit-sidebar-mobile-menu-dropdown
      [items]="items()"
      [visible]="visible()"
      (visibleChange)="visible.set($event)"
    ></fit-sidebar-mobile-menu-dropdown>
    <button data-testid="outside-button">Outside button</button> `,
  imports: [SidebarMobileMenuDropdownComponent],
})
class SidebarMobileMenuDropdownTestComponent {
  items = signal<SidebarLinkItem[]>([]);
  visible = signal<boolean>(false);
}

describe('SidebarMobileMenuDropdownComponent', () => {
  let component: SidebarMobileMenuDropdownTestComponent;
  let fixture: ComponentFixture<SidebarMobileMenuDropdownTestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SidebarMobileMenuDropdownTestComponent],
      imports: [SidebarMobileMenuDropdownComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(SidebarMobileMenuDropdownTestComponent);

    component = fixture.componentInstance;
    component.items.set([
      { label: 'Dashboard', routerLink: '/dashboard', icon: 'lucideHouse' },
      { label: 'Sessions', routerLink: '/sessions', icon: 'lucideCalendar' },
    ]);
    component.visible.set(true);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should close menu when clicking outside', () => {
    outsideButtonElement().click();

    expect(component.visible()).toBe(false);
  });

  it('should close menu when clicking on the menu item', () => {
    firstMenuItemElement().click();

    expect(component.visible()).toBe(false);
  });

  it('should close menu when tabbing out', () => {
    outsideButtonElement().dispatchEvent(
      new FocusEvent('focusin', { bubbles: true }),
    );

    expect(component.visible()).toBe(false);
  });

  it('should not close menu when tabbing inside', () => {
    firstMenuItemElement().dispatchEvent(
      new FocusEvent('focusin', { bubbles: true }),
    );

    expect(component.visible()).toBe(true);
  });

  it('should close menu when pressing escape', () => {
    document.dispatchEvent(
      new KeyboardEvent('keydown', {
        key: 'Escape',
        bubbles: true,
      }),
    );

    expect(component.visible()).toBe(false);
  });

  it('should focus on the first menu item when opening the menu', () => {
    expect(document.activeElement).toBe(firstMenuItemElement());
  });

  it('should arrow down to the next menu item', () => {
    firstMenuItemElement().dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }),
    );

    expect(document.activeElement).toBe(secondMenuItemElement());
  });

  it('should arrow up to the previous menu item', () => {
    secondMenuItemElement().focus();
    secondMenuItemElement().dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true }),
    );

    expect(document.activeElement).toBe(firstMenuItemElement());
  });

  it('should arrow down to the first menu item when at the end', () => {
    secondMenuItemElement().focus();
    secondMenuItemElement().dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }),
    );

    expect(document.activeElement).toBe(firstMenuItemElement());
  });

  it('should arrow up to the last menu item when at the start', () => {
    firstMenuItemElement().focus();
    firstMenuItemElement().dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true }),
    );

    expect(document.activeElement).toBe(secondMenuItemElement());
  });

  it('should focus on the first menu item when pressing home', () => {
    secondMenuItemElement().focus();
    secondMenuItemElement().dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Home', bubbles: true }),
    );

    expect(document.activeElement).toBe(firstMenuItemElement());
  });

  it('should focus on the last menu item when pressing end', () => {
    firstMenuItemElement().focus();
    firstMenuItemElement().dispatchEvent(
      new KeyboardEvent('keydown', { key: 'End', bubbles: true }),
    );

    expect(document.activeElement).toBe(secondMenuItemElement());
  });

  it('should display the menu items', () => {
    expect(fixture.debugElement.queryAll(By.css('a')).length).toBe(2);
    expect(firstMenuItemElement().textContent).toBe('Dashboard');
    expect(secondMenuItemElement().textContent).toBe('Sessions');
  });

  it('should display the menu items with icons', () => {
    expect(iconElementAttribute(firstMenuItemElement())).toBe('lucideHouse');

    expect(iconElementAttribute(secondMenuItemElement())).toBe(
      'lucideCalendar',
    );
  });

  it('should have routerLink attribute on the menu items', () => {
    expect(firstMenuItemElement().getAttribute('ng-reflect-router-link')).toBe(
      '/dashboard',
    );
    expect(secondMenuItemElement().getAttribute('ng-reflect-router-link')).toBe(
      '/sessions',
    );
  });

  const firstMenuItemElement = () =>
    fixture.debugElement.query(By.css('a')).nativeElement;

  const secondMenuItemElement = () =>
    fixture.debugElement.queryAll(By.css('a'))[1].nativeElement;

  const outsideButtonElement = () =>
    fixture.debugElement.query(By.css('[data-testid="outside-button"]'))
      .nativeElement;

  const iconElementAttribute = (element: HTMLElement) =>
    element.querySelector('ng-icon')?.getAttribute('ng-reflect-name');
});
