import { expect, test } from '@playwright/test';
import { InventoryPage } from '../../pages/InventoryPage';
import { LoginPage } from '../../pages/LoginPage';
import { catalog, formatPrice } from '../data/products';
import { users } from '../data/users';

test.describe('Inventory', () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(users.validUser.username, users.validUser.password);
  });

  test('TC-INV-001: inventory page lists all 6 products', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);

    await expect(inventoryPage.inventoryItems).toHaveCount(6);
  });

  test('TC-INV-002: sort products by price, low to high', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    const expectedPrices = catalog.map((p) => p.price).sort((a, b) => a - b).map(formatPrice);

    await inventoryPage.sortBy('Price (low to high)');

    await expect(inventoryPage.itemPrices).toHaveText(expectedPrices);
  });

  test('TC-INV-003: sort products by price, high to low', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    const expectedPrices = catalog.map((p) => p.price).sort((a, b) => b - a).map(formatPrice);

    await inventoryPage.sortBy('Price (high to low)');

    await expect(inventoryPage.itemPrices).toHaveText(expectedPrices);
  });

  test('TC-INV-004: sort products by name, A to Z', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    const expectedNames = catalog.map((p) => p.name).sort((a, b) => a.localeCompare(b));

    // The list loads in A to Z order, so sort Z to A first to prove the A to Z sort does something.
    await inventoryPage.sortBy('Name (Z to A)');
    await expect(inventoryPage.itemNames).toHaveText([...expectedNames].reverse());

    await inventoryPage.sortBy('Name (A to Z)');

    await expect(inventoryPage.itemNames).toHaveText(expectedNames);
  });

  test('TC-INV-005: adding a product updates the cart badge to "1"', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);

    await inventoryPage.addProductToCart('Sauce Labs Backpack');

    await expect(inventoryPage.cartBadge).toHaveText('1');
  });
});
