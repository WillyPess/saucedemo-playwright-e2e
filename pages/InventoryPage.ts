import type { Locator, Page } from '@playwright/test';

export class InventoryPage {
  readonly page: Page;
  readonly inventoryItems: Locator;
  readonly itemNames: Locator;
  readonly itemPrices: Locator;
  readonly sortDropdown: Locator;
  readonly cartBadge: Locator;
  readonly cartLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.inventoryItems = page.locator('[data-test="inventory-item"]');
    this.itemNames = page.locator('[data-test="inventory-item-name"]');
    this.itemPrices = page.locator('[data-test="inventory-item-price"]');
    this.sortDropdown = page.locator('[data-test="product-sort-container"]');
    this.cartBadge = page.locator('[data-test="shopping-cart-badge"]');
    this.cartLink = page.locator('[data-test="shopping-cart-link"]');
  }

  async getProductNames(): Promise<string[]> {
    return this.itemNames.allTextContents();
  }

  async getProductPrices(): Promise<number[]> {
    const rawPrices = await this.itemPrices.allTextContents();
    return rawPrices.map((price) => Number(price.replace('$', '')));
  }

  async addProductToCart(productName: string): Promise<void> {
    const item = this.inventoryItems.filter({ hasText: productName });
    await item.getByRole('button', { name: 'Add to cart' }).click();
  }

  async sortBy(optionLabel: string): Promise<void> {
    await this.sortDropdown.selectOption({ label: optionLabel });
  }

  async goToCart(): Promise<void> {
    await this.cartLink.click();
  }
}
