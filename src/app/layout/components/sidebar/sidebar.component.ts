import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TooltipModule } from 'primeng/tooltip';
import { TieredMenuModule } from 'primeng/tieredmenu';

import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
  lucideDumbbell,
  lucideLandPlot,
  lucideMenu,
  lucideSettings,
  lucideHouse,
} from '@ng-icons/lucide';
import { ButtonModule } from 'primeng/button';
import { PopoverModule } from 'primeng/popover';
import {
  SidebarLinkComponent,
  SidebarLinkItem,
} from '../sidebar-link/sidebar-link.component';
import { ButtonComponent } from '../../../ui/components/button/button.component';

@Component({
  selector: 'fit-sidebar',
  standalone: true,
  imports: [
    NgIconComponent,
    RouterLink,
    RouterLinkActive,
    TooltipModule,
    TieredMenuModule,
    ButtonModule,
    PopoverModule,
    SidebarLinkComponent,
    ButtonComponent,
  ],
  templateUrl: './sidebar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    provideIcons({
      lucideMenu,
      lucideHouse,
      lucideDumbbell,
      lucideLandPlot,
      lucideSettings,
    }),
  ],
  styles: [
    `
      :host {
        @apply z-10 h-14 md:h-dvh md:w-20;
      }
    `,
  ],
})
export class SidebarComponent {
  centralGroup: SidebarLinkItem[] = [
    {
      label: 'Dashboard',
      icon: 'lucideHouse',
      routerLink: '/app/dashboard',
    },
    {
      label: 'Exercises',
      icon: 'lucideDumbbell',
      routerLink: '/app/exercises',
    },
    {
      label: 'Sessions',
      icon: 'lucideLandPlot',
      routerLink: '/app/sessions',
    },
  ];

  bottomGroup: SidebarLinkItem[] = [
    {
      label: 'Settings',
      icon: 'lucideSettings',
      routerLink: '/app/settings',
    },
  ];

  allGroups = [...this.centralGroup, ...this.bottomGroup];
}
