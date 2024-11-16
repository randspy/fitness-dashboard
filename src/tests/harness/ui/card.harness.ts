import { ComponentHarness } from '@angular/cdk/testing';

export class CardComponentHarness extends ComponentHarness {
  static hostSelector = 'fit-card';

  private getHeader = this.locatorForOptional('.p-card-title');

  async getHeaderText(): Promise<string | null> {
    const header = await this.getHeader();
    return header ? header.text() : null;
  }
}
