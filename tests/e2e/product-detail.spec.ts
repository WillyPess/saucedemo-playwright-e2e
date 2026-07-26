import { expect, test } from '@playwright/test';
import { InventoryPage } from '../../pages/InventoryPage';
import { LoginPage } from '../../pages/LoginPage';
import { ProductDetailPage } from '../../pages/ProductDetailPage';
import { users } from '../data/users';

test.describe('Product Detail Page', () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(users.validUser.username, users.validUser.password);
  });

  test('TC-PDP-001: product detail page shows correct name and price', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    const productDetailPage = new ProductDetailPage(page);

    const [expectedName] = await inventoryPage.getProductNames();
    const [expectedPrice] = await inventoryPage.getProductPrices();

    await inventoryPage.itemNames.first().click();

    await expect(productDetailPage.productName).toHaveText(expectedName);
    const actualPrice = await productDetailPage.getProductPrice();
    expect(actualPrice).toBe(expectedPrice);
  });

  test('TC-PDP-002: add to cart from the detail page updates the badge', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    const productDetailPage = new ProductDetailPage(page);

    await inventoryPage.itemNames.first().click();
    await productDetailPage.addToCart();

    await expect(productDetailPage.cartBadge).toHaveText('1');
  });

  test('TC-PDP-003: Back to products returns to inventory', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    const productDetailPage = new ProductDetailPage(page);

    await inventoryPage.itemNames.first().click();
    await productDetailPage.backToProducts();

    await expect(page).toHaveURL(/inventory\.html/);
  });
});
