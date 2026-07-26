import type { Locator, Page } from '@playwright/test';

export class CartPage {
  readonly page: Page;
  readonly cartItems: Locator;
  readonly cartBadge: Locator;
  readonly continueShoppingButton: Locator;
  readonly checkoutButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.cartItems = page.locator('[data-test="inventory-item"]');
    this.cartBadge = page.locator('[data-test="shopping-cart-badge"]');
    this.continueShoppingButton = page.locator('[data-test="continue-shopping"]');
    this.checkoutButton = page.locator('[data-test="checkout"]');
  }

  async removeProduct(productName: string): Promise<void> {
    const item = this.cartItems.filter({ hasText: productName });
    await item.getByRole('button', { name: 'Remove' }).click();
  }

  async continueShopping(): Promise<void> {
    await this.continueShoppingButton.click();
  }

  async checkout(): Promise<void> {
    await this.checkoutButton.click();
  }
}
