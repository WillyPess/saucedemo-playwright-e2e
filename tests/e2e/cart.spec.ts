import { expect, test } from '@playwright/test';
import { CartPage } from '../../pages/CartPage';
import { InventoryPage } from '../../pages/InventoryPage';
import { LoginPage } from '../../pages/LoginPage';
import { users } from '../data/users';

test.describe('Cart', () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(users.validUser.username, users.validUser.password);
  });

  test('TC-CART-001: adding a single item shows it on the cart page', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);

    await inventoryPage.addProductToCart('Sauce Labs Backpack');
    const [expectedName] = await inventoryPage.getProductNames();
    const [expectedPrice] = await inventoryPage.getProductPrices();

    await inventoryPage.goToCart();

    await expect(cartPage.cartItems).toHaveCount(1);
    await expect(cartPage.cartItems).toContainText(expectedName);
    await expect(cartPage.cartItems).toContainText(`$${expectedPrice}`);
  });

  test('TC-CART-002: removing an item clears it and the badge', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);

    await inventoryPage.addProductToCart('Sauce Labs Backpack');
    await inventoryPage.goToCart();

    await cartPage.removeProduct('Sauce Labs Backpack');

    await expect(cartPage.cartItems).toHaveCount(0);
    await expect(cartPage.cartBadge).not.toBeVisible();
  });

  test('TC-CART-003: cart badge count matches items added', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);

    await inventoryPage.addProductToCart('Sauce Labs Backpack');
    await inventoryPage.addProductToCart('Sauce Labs Bike Light');
    await inventoryPage.addProductToCart('Sauce Labs Bolt T-Shirt');

    await expect(inventoryPage.cartBadge).toHaveText('3');
  });

  test('TC-CART-004: Continue Shopping returns to inventory and keeps the cart item', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);

    await inventoryPage.addProductToCart('Sauce Labs Backpack');
    await inventoryPage.goToCart();

    await cartPage.continueShopping();

    await expect(page).toHaveURL(/inventory\.html/);
    await expect(inventoryPage.cartBadge).toHaveText('1');
  });
});
