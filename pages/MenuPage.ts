import type { Locator, Page } from '@playwright/test';

export class MenuPage {
  readonly page: Page;
  readonly openMenuButton: Locator;
  readonly logoutLink: Locator;
  readonly resetAppStateLink: Locator;
  readonly allItemsLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.openMenuButton = page.locator('#react-burger-menu-btn');
    this.logoutLink = page.locator('[data-test="logout-sidebar-link"]');
    this.resetAppStateLink = page.locator('[data-test="reset-sidebar-link"]');
    this.allItemsLink = page.locator('[data-test="inventory-sidebar-link"]');
  }

  async open(): Promise<void> {
    await this.openMenuButton.click();
  }

  async logout(): Promise<void> {
    await this.logoutLink.click();
  }

  async resetAppState(): Promise<void> {
    await this.resetAppStateLink.click();
  }

  async goToAllItems(): Promise<void> {
    await this.allItemsLink.click();
  }
}
