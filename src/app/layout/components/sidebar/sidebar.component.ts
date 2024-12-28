import { ChangeDetectionStrategy, Component } from '@angular/core';
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
import { SidebarLinkComponent } from '../sidebar-link/sidebar-link.component';

import {
  DashboardRoute,
  SessionsRoute,
  ExercisesRoute,
} from '../../../core/shared/domain/routes.config';
import { SidebarMobileMenuComponent } from '../sidebar-mobile-menu/sidebar-mobile-menu.component';
import { SidebarLinkItem } from '../../domain/sidebar-link-item.types';

@Component({
  selector: 'fit-sidebar',
  standalone: true,
  imports: [
    NgIconComponent,
    TooltipModule,
    TieredMenuModule,
    ButtonModule,
    PopoverModule,
    SidebarLinkComponent,
    SidebarMobileMenuComponent,
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
      routerLink: DashboardRoute,
    },
    {
      label: 'Sessions',
      icon: 'lucideLandPlot',
      routerLink: SessionsRoute,
    },
    {
      label: 'Exercises',
      icon: 'lucideDumbbell',
      routerLink: ExercisesRoute,
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
