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

  async getAriaLabel(): Promise<string | null> {
    const ariaLabel = await this.label();
    return ariaLabel.getAttribute('aria-label');
  }

  async getText(): Promise<string | null> {
    const content = await this.label();
    return content.text();
  }
}
