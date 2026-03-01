import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { config } from '../config/env';

test.describe('login', () => {
    test('login happy path', async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.goto();
        await loginPage.loginWithEnvCredentials();

        await expect(page).toHaveURL(loginPage.url);
        await expect(loginPage.shoppingCart).toBeVisible();
        await expect(loginPage.logOut).toBeVisible();
        // commit test
    });

    test('login with invalid password', async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.goto();
        await loginPage.login(config.credentials.email, 'admin1234');

        await expect(loginPage.errorMessage).toBeVisible();
        await expect(loginPage.shoppingCart).not.toBeVisible();
        await expect(loginPage.logOut).not.toBeVisible();
    });

    test('login with invalid email', async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.goto();
        await loginPage.login('admin@admin.com1', config.credentials.password);

        await expect(loginPage.errorMessage).toBeVisible();
        await expect(loginPage.shoppingCart).not.toBeVisible();
        await expect(loginPage.logOut).not.toBeVisible();
    });
});
