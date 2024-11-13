import {
  BaseHarnessFilters,
  ComponentHarness,
  HarnessPredicate,
} from '@angular/cdk/testing';

export interface LinkHarnessFilters {
  link?: string | RegExp;
  text?: string | RegExp;
}

export class LinkComponentHarness extends ComponentHarness {
  static hostSelector = 'fit-link';

  static with(
    options: BaseHarnessFilters,
  ): HarnessPredicate<LinkComponentHarness> {
    return new HarnessPredicate(LinkComponentHarness, options);
  }

  async getLink(): Promise<string | null> {
    return (await this.host()).getAttribute('ng-reflect-link');
  }
}
