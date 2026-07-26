import { expect, test } from '@playwright/test';
import { InventoryPage } from '../../pages/InventoryPage';
import { LoginPage } from '../../pages/LoginPage';
import { MenuPage } from '../../pages/MenuPage';
import { users } from '../data/users';

test.describe('Navigation Menu', () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(users.validUser.username, users.validUser.password);
  });

  test('TC-NAV-001: logout returns to the login page', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const menuPage = new MenuPage(page);

    await menuPage.open();
    await menuPage.logout();

    await expect(loginPage.loginButton).toBeVisible();
  });

  test('TC-NAV-002: reset app state clears the cart', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    const menuPage = new MenuPage(page);

    await inventoryPage.addProductToCart('Sauce Labs Backpack');
    await inventoryPage.addProductToCart('Sauce Labs Bike Light');

    await menuPage.open();
    await menuPage.resetAppState();

    await expect(inventoryPage.cartBadge).not.toBeVisible();
  });

  test('TC-NAV-003: All Items returns to inventory from any page', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    const menuPage = new MenuPage(page);

    await inventoryPage.goToCart();

    await menuPage.open();
    await menuPage.goToAllItems();

    await expect(page).toHaveURL(/inventory\.html/);
  });
});
