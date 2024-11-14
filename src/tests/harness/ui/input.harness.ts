import {
  BaseHarnessFilters,
  ComponentHarness,
  HarnessPredicate,
} from '@angular/cdk/testing';

export interface WithinConfig {
  selector: string;
  index?: number;
}

export interface InputHarnessFilters extends BaseHarnessFilters {
  formControlName?: string;
  within?: {
    selector: string;
    index: number;
    path?: WithinConfig[];
  };
}

export class InputComponentHarness extends ComponentHarness {
  static hostSelector = 'fit-input';

  static with(
    options: InputHarnessFilters = {},
  ): HarnessPredicate<InputComponentHarness> {
    return new HarnessPredicate(InputComponentHarness, options)
      .addOption(
        'formControlName',
        options.formControlName,
        async (harness, formControlName) =>
          HarnessPredicate.stringMatches(
            await (await harness.host()).getAttribute('ng-reflect-name'),
            formControlName,
          ),
      )
      .addOption('within', options.within, async (harness, withinOpts) => {
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

        if (!selector.includes('fit-input')) {
          selector += ' fit-input';
        }

        return host.matchesSelector(selector);
      });
  }

  private getInput = this.locatorFor('input');
  private getError = this.locatorForOptional('p.text-error');

  async setValue(value: string): Promise<void> {
    const input = await this.getInput();
    await input.clear();

    if (value !== '') {
      await input.sendKeys(value);
    }
  }

  async getValue(): Promise<string> {
    const input = await this.getInput();
    return input.getProperty('value');
  }

  async getErrorMessage(): Promise<string | null> {
    const error = await this.getError();
    return error ? error.text() : null;
  }

  async isInvalid(): Promise<boolean> {
    const input = await this.getInput();
    const classList = await input.getAttribute('class');
    return classList?.includes('ng-invalid') ?? false;
  }

  async isTouched(): Promise<boolean> {
    const input = await this.getInput();
    const classList = await input.getAttribute('class');
    return classList?.includes('ng-touched') ?? false;
  }
}
