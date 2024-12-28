import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  effect,
  ElementRef,
  inject,
  input,
  model,
  signal,
  untracked,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIconComponent } from '@ng-icons/core';
import { SidebarLinkItem } from '../../domain/sidebar-link-item.types';

@Component({
  selector: 'fit-sidebar-mobile-menu-dropdown',
  standalone: true,
  imports: [CommonModule, RouterLink, NgIconComponent],
  templateUrl: './sidebar-mobile-menu-dropdown.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(document:click)': 'closeMenu()',
    '(document:keydown.escape)': 'closeMenu()',
    '(document:focusin)': 'onFocusOut($event)',
  },
})
export class SidebarMobileMenuDropdownComponent {
  private elementRef = inject(ElementRef);
  private shouldFocusFirstItem = signal(true);
  private menuItemsSelector = '[role="menuitem"]';

  items = input.required<SidebarLinkItem[]>();
  visible = model.required<boolean>();

  constructor() {
    effect(() => {
      if (this.shouldFocusFirstItem()) {
        this.focusFirstMenuItem();
        untracked(() => {
          this.shouldFocusFirstItem.set(false);
        });
      }
    });
  }

  closeMenu(): void {
    this.visible.set(false);
  }

  onFocusOut(event: FocusEvent): void {
    const focusedInside = this.elementRef.nativeElement.contains(
      event.target as HTMLElement,
    );

    if (!focusedInside) {
      this.closeMenu();
    }
  }

  private focusFirstMenuItem(): void {
    const firstMenuItem = this.elementRef.nativeElement.querySelector(
      this.menuItemsSelector,
    ) as HTMLElement;

    if (firstMenuItem) {
      firstMenuItem.focus();
    }
  }

  onKeydown(event: KeyboardEvent): void {
    const menuItems = Array.from(
      this.elementRef.nativeElement.querySelectorAll(this.menuItemsSelector),
    ) as HTMLElement[];
    const currentIndex = menuItems.indexOf(
      document.activeElement as HTMLElement,
    );

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      const nextIndex = (currentIndex + 1) % menuItems.length;
      menuItems[nextIndex].focus();
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      const prevIndex =
        (currentIndex - 1 + menuItems.length) % menuItems.length;
      menuItems[prevIndex].focus();
    } else if (event.key === 'Home') {
      event.preventDefault();
      menuItems[0].focus();
    } else if (event.key === 'End') {
      event.preventDefault();
      menuItems[menuItems.length - 1].focus();
    }
  }
}
