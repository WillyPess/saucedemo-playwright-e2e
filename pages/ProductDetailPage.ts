import type { Locator, Page } from '@playwright/test';

export class ProductDetailPage {
  readonly page: Page;
  readonly productName: Locator;
  readonly productPrice: Locator;
  readonly addToCartButton: Locator;
  readonly backToProductsButton: Locator;
  readonly cartBadge: Locator;

  constructor(page: Page) {
    this.page = page;
    this.productName = page.locator('[data-test="inventory-item-name"]');
    this.productPrice = page.locator('[data-test="inventory-item-price"]');
    this.addToCartButton = page.getByRole('button', { name: 'Add to cart' });
    this.backToProductsButton = page.locator('[data-test="back-to-products"]');
    this.cartBadge = page.locator('[data-test="shopping-cart-badge"]');
  }

  async getProductName(): Promise<string> {
    return this.productName.innerText();
  }

  async getProductPrice(): Promise<number> {
    const rawPrice = await this.productPrice.innerText();
    return Number(rawPrice.replace('$', ''));
  }

  async addToCart(): Promise<void> {
    await this.addToCartButton.click();
  }

  async backToProducts(): Promise<void> {
    await this.backToProductsButton.click();
  }
}
