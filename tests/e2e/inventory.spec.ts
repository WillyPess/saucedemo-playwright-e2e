import { expect, test } from '@playwright/test';
import { InventoryPage } from '../../pages/InventoryPage';
import { LoginPage } from '../../pages/LoginPage';
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

    await inventoryPage.sortBy('Price (low to high)');
    const prices = await inventoryPage.getProductPrices();
    const sortedPrices = [...prices].sort((a, b) => a - b);

    expect(prices).toEqual(sortedPrices);
  });

  test('TC-INV-003: sort products by price, high to low', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);

    await inventoryPage.sortBy('Price (high to low)');
    const prices = await inventoryPage.getProductPrices();
    const sortedPrices = [...prices].sort((a, b) => b - a);

    expect(prices).toEqual(sortedPrices);
  });

  test('TC-INV-004: sort products by name, A to Z', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);

    await inventoryPage.sortBy('Name (A to Z)');
    const names = await inventoryPage.getProductNames();
    const sortedNames = [...names].sort((a, b) => a.localeCompare(b));

    expect(names).toEqual(sortedNames);
  });

  test('TC-INV-005: adding a product updates the cart badge to "1"', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);

    await inventoryPage.addProductToCart('Sauce Labs Backpack');

    await expect(inventoryPage.cartBadge).toHaveText('1');
  });
});
