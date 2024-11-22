import {
  BaseHarnessFilters,
  ComponentHarness,
  HarnessPredicate,
} from '@angular/cdk/testing';

export class LinkComponentHarness extends ComponentHarness {
  static hostSelector = 'fit-link';

  static with(
    options: BaseHarnessFilters,
  ): HarnessPredicate<LinkComponentHarness> {
    return new HarnessPredicate(LinkComponentHarness, options);
  }

  private label = this.locatorFor('a');

  async getLink(): Promise<string | null> {
    return (await this.label()).getAttribute('href');
  }
}
