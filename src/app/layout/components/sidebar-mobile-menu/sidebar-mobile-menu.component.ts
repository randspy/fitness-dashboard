import {
  ChangeDetectionStrategy,
  Component,
  input,
  signal,
} from '@angular/core';
import { SidebarMobileMenuDropdownComponent } from '../sidebar-mobile-menu-dropdown/sidebar-mobile-menu-dropdown.component';
import { ButtonComponent } from '../../../ui/components/button/button.component';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { lucideMenu } from '@ng-icons/lucide';
import { SidebarLinkItem } from '../../domain/sidebar-link-item.types';

@Component({
  selector: 'fit-sidebar-mobile-menu',
  standalone: true,
  imports: [
    SidebarMobileMenuDropdownComponent,
    ButtonComponent,
    NgIconComponent,
  ],
  templateUrl: './sidebar-mobile-menu.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    provideIcons({
      lucideMenu,
    }),
  ],
})
export class SidebarMobileMenuComponent {
  items = input.required<SidebarLinkItem[]>();
  visible = signal(false);

  toggle(event: Event) {
    event.stopPropagation();
    this.visible.update((v) => !v);
  }
}
