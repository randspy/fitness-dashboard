import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TooltipModule } from 'primeng/tooltip';
import { SidebarLinkItem } from '../../domain/sidebar-link-item.types';

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
