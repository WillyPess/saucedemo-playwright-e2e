import type { Locator, Page } from '@playwright/test';

export class CheckoutStep2Page {
  readonly page: Page;
  readonly itemTotalLabel: Locator;
  readonly taxLabel: Locator;
  readonly totalLabel: Locator;
  readonly finishButton: Locator;
  readonly completeHeader: Locator;

  constructor(page: Page) {
    this.page = page;
    this.itemTotalLabel = page.locator('[data-test="subtotal-label"]');
    this.taxLabel = page.locator('[data-test="tax-label"]');
    this.totalLabel = page.locator('[data-test="total-label"]');
    this.finishButton = page.locator('[data-test="finish"]');
    this.completeHeader = page.locator('[data-test="complete-header"]');
  }

  private async extractAmount(locator: Locator): Promise<number> {
    const text = await locator.textContent();
    const match = text?.match(/\$([\d.]+)/);
    return match ? Number(match[1]) : NaN;
  }

  async getItemTotal(): Promise<number> {
    return this.extractAmount(this.itemTotalLabel);
  }

  async getTax(): Promise<number> {
    return this.extractAmount(this.taxLabel);
  }

  async getTotal(): Promise<number> {
    return this.extractAmount(this.totalLabel);
  }

  async finish(): Promise<void> {
    await this.finishButton.click();
  }
}
