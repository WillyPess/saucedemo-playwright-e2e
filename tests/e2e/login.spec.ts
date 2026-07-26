import { expect, test } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { messages } from '../data/messages';
import { users, wrongPassword } from '../data/users';

test.describe('Login flow', () => {
  test('successful login with a valid user', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    await loginPage.login(users.validUser.username, users.validUser.password);

    await expect(page).toHaveURL(/inventory\.html/);
  });

  test('login fails with a locked-out user', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    await loginPage.login(users.lockedUser.username, users.lockedUser.password);

    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toHaveText(messages.lockedOut);
  });

  test('login fails with wrong password', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    await loginPage.login(users.validUser.username, wrongPassword);

    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toHaveText(messages.invalidCredentials);
  });
});
