import { expect, test } from '@playwright/test';
import { CartPage } from '../../pages/CartPage';
import { CheckoutPage } from '../../pages/CheckoutPage';
import { CheckoutStep2Page } from '../../pages/CheckoutStep2Page';
import { InventoryPage } from '../../pages/InventoryPage';
import { LoginPage } from '../../pages/LoginPage';
import { products, taxRate } from '../data/products';
import { users } from '../data/users';

test.describe('Checkout', () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(users.validUser.username, users.validUser.password);
  });

  test('TC-CO-001: complete checkout with valid customer info', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);
    const checkoutStep2Page = new CheckoutStep2Page(page);

    await inventoryPage.addProductToCart('Sauce Labs Backpack');
    await inventoryPage.goToCart();
    await cartPage.checkout();

    await checkoutPage.fillInfo('John', 'Doe', '12345');
    await checkoutPage.continueCheckout();
    await checkoutStep2Page.finish();

    await expect(checkoutStep2Page.completeHeader).toBeVisible();
    await expect(checkoutStep2Page.completeHeader).toHaveText('Thank you for your order!');
  });

  test('TC-CO-002: checkout blocked when a required field is missing', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);

    await inventoryPage.addProductToCart('Sauce Labs Backpack');
    await inventoryPage.goToCart();
    await cartPage.checkout();

    await checkoutPage.fillInfo('John', 'Doe', '');
    await checkoutPage.continueCheckout();

    await expect(page).toHaveURL(/checkout-step-one\.html/);
    await expect(checkoutPage.errorMessage).toBeVisible();
    await expect(checkoutPage.errorMessage).toContainText('Postal Code is required');
  });

  test('TC-CO-003: order summary reflects correct item total, tax and total', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);
    const checkoutStep2Page = new CheckoutStep2Page(page);

    await inventoryPage.addProductToCart(products.backpack.name);
    await inventoryPage.addProductToCart(products.bikeLight.name);
    await inventoryPage.goToCart();
    await cartPage.checkout();

    await checkoutPage.fillInfo('John', 'Doe', '12345');
    await checkoutPage.continueCheckout();

    const expectedItemTotal = products.backpack.price + products.bikeLight.price;
    const expectedTax = Math.round(expectedItemTotal * taxRate * 100) / 100;
    const itemTotal = await checkoutStep2Page.getItemTotal();
    const tax = await checkoutStep2Page.getTax();
    const total = await checkoutStep2Page.getTotal();

    expect(itemTotal).toBeCloseTo(expectedItemTotal, 2);
    expect(tax).toBeCloseTo(expectedTax, 2);
    expect(total).toBeCloseTo(itemTotal + tax, 2);
  });

  test('TC-CO-004: cancel during checkout returns to the cart', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);

    await inventoryPage.addProductToCart('Sauce Labs Backpack');
    await inventoryPage.goToCart();
    await cartPage.checkout();

    await checkoutPage.cancel();

    await expect(page).toHaveURL(/cart\.html/);
    await expect(cartPage.cartItems).toHaveCount(1);
  });
});
