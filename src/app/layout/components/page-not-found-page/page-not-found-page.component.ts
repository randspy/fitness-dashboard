import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LinkComponent } from '../../../ui/components/link/link.component';
import {
  DefaultRoute,
  DefaultRoutePageName,
} from '../../../core/shared/domain/routes.config';

@Component({
  selector: 'fit-page-not-found-page',
  standalone: true,
  imports: [LinkComponent],
  templateUrl: './page-not-found-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageNotFoundPageComponent {
  routeUrl = DefaultRoute;
  pageName = DefaultRoutePageName;
}
