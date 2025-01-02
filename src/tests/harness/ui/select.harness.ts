import {
  BaseHarnessFilters,
  ComponentHarness,
  HarnessPredicate,
} from '@angular/cdk/testing';

export interface SelectHarnessFilters extends BaseHarnessFilters {
  within?: {
    selector: string;
    index: number;
    path?: { selector: string; index?: number }[];
  };
}

export class SelectComponentHarness extends ComponentHarness {
  static hostSelector = 'fit-select';

  static with(
    options: SelectHarnessFilters = {},
  ): HarnessPredicate<SelectComponentHarness> {
    return new HarnessPredicate(SelectComponentHarness, options).addOption(
      'within',
      options.within,
      async (harness, withinOpts) => {
        const host = await harness.host();
        let selector = `${withinOpts.selector}:nth-of-type(${withinOpts.index + 1})`;

        if (withinOpts.path) {
          withinOpts.path.forEach((config) => {
            selector += ` ${config.selector}`;
            if (config.index !== undefined) {
              selector += `:nth-of-type(${config.index + 1})`;
            }
          });
        }

        if (!selector.includes('fit-select')) {
          selector += ' fit-select';
        }

        return host.matchesSelector(selector);
      },
    );
  }

  private getSelect = this.locatorFor('p-select');
  private getError = this.locatorForOptional('p.text-error');

  async setValue(value: string): Promise<void> {
    const select = await this.getSelect();

    await select.dispatchEvent('ngModelChange', { id: value });
    await select.dispatchEvent('onChange', { id: value });
  }

  async getValue(): Promise<string> {
    const selectedValue = await this.locatorFor('p-select span')();
    return selectedValue ? selectedValue.text() : '';
  }

  async getErrorMessage(): Promise<string | null> {
    const error = await this.getError();
    return error ? error.text() : null;
  }

  async isInvalid(): Promise<boolean> {
    const select = await this.getSelect();
    const classList = await select.getAttribute('class');
    return classList?.includes('ng-invalid') ?? false;
  }

  async isTouched(): Promise<boolean> {
    const select = await this.getSelect();
    const classList = await select.getAttribute('class');
    return classList?.includes('ng-touched') ?? false;
  }

  async getOptions(): Promise<string[]> {
    const select = await this.getSelect();
    await select.dispatchEvent('click', {});
    const options = await this.locatorForAll(
      'div[data-testid="select-option"]',
    )();
    const texts = await Promise.all(options.map((option) => option.text()));
    return texts;
  }
}
