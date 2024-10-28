import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TooltipModule } from 'primeng/tooltip';

export interface SidebarLinkItem {
  label: string;
  icon: string;
  routerLink: string;
}

@Component({
  selector: 'fit-sidebar-link',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, TooltipModule],
  templateUrl: './sidebar-link.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarLinkComponent {
  item = input.required<SidebarLinkItem>();
}
