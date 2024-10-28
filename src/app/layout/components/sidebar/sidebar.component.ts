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
import { NgIf } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { PopoverModule } from 'primeng/popover';
import {
  SidebarLinkComponent,
  SidebarLinkItem,
} from '../sidebar-link/sidebar-link.component';

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
    NgIf,
    PopoverModule,
    SidebarLinkComponent,
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
      label: 'Workouts',
      icon: 'lucideLandPlot',
      routerLink: '/app/workouts',
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
