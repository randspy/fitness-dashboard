import { ComponentHarness } from '@angular/cdk/testing';

export class TextareaComponentHarness extends ComponentHarness {
  static hostSelector = 'fit-textarea';

  private getTextarea = this.locatorFor('textarea');

  async setValue(value: string): Promise<void> {
    const textarea = await this.getTextarea();
    await textarea.clear();
    await textarea.sendKeys(value);
  }
}
