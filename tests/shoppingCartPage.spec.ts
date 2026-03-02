import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { ShoppingCartPage } from '../pages/ShoppingCartPage';

const ITEMS_EVERY_NTH = 3;
const ITEMS_IN_ADD_REMOVE_TEST = 3;

async function addItemsAndProceedToCheckout(shoppingCartPage: ShoppingCartPage): Promise<string> {
    const totalVisible = await shoppingCartPage.getShopItemCount();
    const numToAdd = Math.floor(Math.random() * totalVisible) + 1;
    for (let i = 0; i < numToAdd; i++) {
        await shoppingCartPage.addShopItemToCart(i);
    }
    const orderTotal = await shoppingCartPage.getCartTotalText();
    await shoppingCartPage.proceedToCheckout();
    await expect(shoppingCartPage.shippingDetailsHeading).toBeVisible();
    return orderTotal;
}

test.describe('shopping cart', () => {

    test.beforeEach(async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.goto();
        await loginPage.loginWithEnvCredentials();
    });

    test('verifies cart total when adding every nth item', async ({ page }) => {
        const shoppingCartPage = new ShoppingCartPage(page);
        const count = await shoppingCartPage.getShopItemCount();
        const productNames: string[] = [];
        let runningTotal = 0;

        for (let i = 0; i < count && productNames.length < ITEMS_EVERY_NTH; i += ITEMS_EVERY_NTH) {
            const name = await shoppingCartPage.getShopItemName(i);
            if (name) productNames.push(name);

            const price = await shoppingCartPage.getShopItemPrice(i);
            runningTotal += price;

            await shoppingCartPage.addShopItemToCart(i);

            const expectedTotal = `$${runningTotal.toFixed(2)}`;
            await expect(shoppingCartPage.cartTotal).toContainText(expectedTotal);
        }

        for (const productName of productNames) {
            await expect(shoppingCartPage.getCartItem(productName).first()).toBeVisible();
        }
    });

    test('verifies cart total when adding and removing items', async ({ page }) => {
        const shoppingCartPage = new ShoppingCartPage(page);
        let expectedTotal = 0;
        const addedItems: { name: string; price: number }[] = [];

        const assertTotal = async () => {
            await expect(shoppingCartPage.cartTotal).toContainText(`$${expectedTotal.toFixed(2)}`);
        };

        const add = async (index: number) => {
            const name = await shoppingCartPage.getShopItemName(index);
            const price = await shoppingCartPage.getShopItemPrice(index);
            expectedTotal += price;
            if (name) addedItems.push({ name, price });
            await shoppingCartPage.addShopItemToCart(index);
            await assertTotal();
        };

        const remove = async (productName: string) => {
            const item = addedItems.find((i) => i.name === productName);
            if (item) {
                expectedTotal -= item.price;
                addedItems.splice(addedItems.indexOf(item), 1);
            }
            await shoppingCartPage.removeCartItem(productName);
            await assertTotal();
        };

        for (let i = 0; i < ITEMS_IN_ADD_REMOVE_TEST; i++) {
            await add(i);
        }
        const first = addedItems[0];
        const second = addedItems[1];
        if (first) await remove(first.name);
        if (second) await remove(second.name);
        await assertTotal();
    });

    test('proceed to checkout with empty cart leaves cart empty', async ({ page }) => {
        const shoppingCartPage = new ShoppingCartPage(page);
        await shoppingCartPage.proceedToCheckout();
        await expect(page.getByRole('button', { name: 'REMOVE' })).toHaveCount(0);
    });

    test('proceed to checkout shows Shipping Details', async ({ page }) => {
        const shoppingCartPage = new ShoppingCartPage(page);
        await addItemsAndProceedToCheckout(shoppingCartPage);
    });

    test('checkout with shipping and submit order succeeds', async ({ page }) => {
        const shoppingCartPage = new ShoppingCartPage(page);
        const orderTotal = await addItemsAndProceedToCheckout(shoppingCartPage);

        const street = '123 Main St';
        const city = 'New York';
        const country = 'United States of America';

        await shoppingCartPage.fillShippingDetails(
            '5551234567',
            street,
            city,
            country
        );
        await shoppingCartPage.submitOrder();

        await expect(shoppingCartPage.submitOrderButton).not.toBeVisible();

        const successMessage = shoppingCartPage.orderSuccessMessage;
        await expect(successMessage).toBeVisible();
        await expect(successMessage).toContainText(orderTotal);
        await expect(successMessage).toContainText(`${street}, ${city} - ${country}`);
    });
});