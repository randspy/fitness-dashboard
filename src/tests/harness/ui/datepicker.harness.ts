import { BaseHarnessFilters, ComponentHarness } from '@angular/cdk/testing';

export interface DatepickerHarnessFilters extends BaseHarnessFilters {
  label?: string | RegExp;
  value?: string | RegExp;
  placeholder?: string | RegExp;
  ancestor?: string;
  class?: string | RegExp;
}

export class DatepickerComponentHarness extends ComponentHarness {
  static hostSelector = 'fit-datepicker';

  private getDatepicker = this.locatorFor('p-datepicker');
  private getDatepickerInput = this.locatorFor('p-datepicker input');
  private getError = this.locatorForOptional('fit-datepicker .text-error');

  async setValue(date: Date): Promise<void> {
    const input = await this.getDatepickerInput();
    const formattedDate = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
    await input.setInputValue(formattedDate);
  }

  async getValue(): Promise<string> {
    const input = await this.getDatepickerInput();
    return input.getProperty('value');
  }

  async getErrorMessage(): Promise<string | null> {
    const error = await this.getError();
    return error ? error.text() : null;
  }

  async isInvalid(): Promise<boolean> {
    const datepicker = await this.getDatepicker();
    const classList = await datepicker.getAttribute('class');
    return !!classList?.includes('ng-invalid');
  }

  async isTouched(): Promise<boolean> {
    const datepicker = await this.getDatepicker();
    const classList = await datepicker.getAttribute('class');
    return !!classList?.includes('ng-touched');
  }
}
