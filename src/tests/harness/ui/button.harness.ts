import {
  BaseHarnessFilters,
  ComponentHarness,
  HarnessPredicate,
} from '@angular/cdk/testing';

export interface ButtonHarnessFilters extends BaseHarnessFilters {
  testId?: string | RegExp;
}

export class ButtonComponentHarness extends ComponentHarness {
  static hostSelector = 'fit-button';

  static with(
    options: ButtonHarnessFilters = {},
  ): HarnessPredicate<ButtonComponentHarness> {
    return new HarnessPredicate(ButtonComponentHarness, options).addOption(
      'testId',
      options.testId,
      async (harness, pattern) =>
        HarnessPredicate.stringMatches(
          await (await harness.host()).getAttribute('data-testid'),
          pattern,
        ),
    );
  }

  private getButton = this.locatorFor('.p-button');

  async click(): Promise<void> {
    return (await this.getButton()).click();
  }
}
