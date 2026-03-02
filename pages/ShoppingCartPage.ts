import { Locator, Page } from '@playwright/test';

export class ShoppingCartPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /* Locators */
  get shopItems() {
    return this.page.locator('.shop-item');
  }

  /** Grand total in the cart. Prefer .cart-total element; fallback to total text within a section that has PROCEED TO CHECKOUT. */
  get cartTotal() {
    const withCheckoutButton = this.page
      .locator('*')
      .filter({ has: this.proceedToCheckoutButton })
      .first();
    return this.page
      .locator('.cart-total')
      .or(withCheckoutButton.getByText(/Total\s*\$[\d.]+/));
  }

  get proceedToCheckoutButton() {
    return this.page.getByRole('button', { name: 'PROCEED TO CHECKOUT' });
  }

  get shippingDetailsHeading() {
    return this.page.getByText('Shipping Details');
  }

  /** Section containing the Shipping Details form. Prefer <form> that has the heading, else the heading's parent. */
  get shippingSection() {
    return this.page
      .locator('form')
      .filter({ has: this.shippingDetailsHeading })
      .first()
      .or(this.shippingDetailsHeading.locator('..'));
  }

  /** Stable locators using form field names (name attribute) within the shipping section. */
  get phoneInput() {
    return this.shippingSection.locator('input[name="phone"]');
  }

  get streetInput() {
    return this.shippingSection.locator('input[name="street"]');
  }

  get cityInput() {
    return this.shippingSection.locator('input[name="city"]');
  }

  get countrySelect() {
    return this.shippingSection.locator('select[name="country"]');
  }

  get submitOrderButton() {
    return this.shippingSection.getByRole('button', { name: 'Submit Order' });
  }

  /** Order success message after submit (e.g. "Congrats! Your order of $X.XX has been registered and will be shipped to..."). */
  get orderSuccessMessage() {
    return this.page.getByText(/order.*(registered|placed|confirmed).*shipped|Congrats.*order/i);
  }

  /* Actions */
  async getShopItemCount(): Promise<number> {
    return this.shopItems.count();
  }

  async getShopItemName(index: number): Promise<string | null> {
    const name = await this.shopItems.nth(index).locator('.shop-item-title').textContent();
    return name ? name.trim() : null;
  }

  async getShopItemPrice(index: number): Promise<number> {
    const priceText = await this.shopItems.nth(index).locator('.shop-item-price').textContent();
    return priceText ? parseFloat(priceText.replace(/[^0-9.]/g, '')) : 0;
  }

  async addShopItemToCart(index: number): Promise<void> {
    await this.shopItems.nth(index).getByRole('button', { name: 'ADD TO CART' }).click();
  }

  getCartItem(productName: string): Locator {
    return this.page
      .locator('.cart-row, .cart-item, tr')
      .filter({ hasText: productName })
      .filter({ has: this.page.getByRole('button', { name: 'REMOVE' }) });
  }

  async removeCartItem(productName: string): Promise<void> {
    const cartRow = this.getCartItem(productName).first();
    await cartRow.getByRole('button', { name: 'REMOVE' }).first().click();
  }

  async proceedToCheckout(): Promise<void> {
    await this.proceedToCheckoutButton.click();
  }

  async fillShippingDetails(phone: string, street: string, city: string, country: string): Promise<void> {
    await this.phoneInput.fill(phone);
    await this.streetInput.fill(street);
    await this.cityInput.fill(city);
    await this.countrySelect.selectOption({ label: country });
  }

  async submitOrder(): Promise<void> {
    await this.submitOrderButton.click();
  }

  /** Reads the cart total text from the page (e.g. "$9.99" or "$9.9") before submit. */
  async getCartTotalText(): Promise<string> {
    const text = await this.cartTotal.textContent();
    const match = text?.match(/\$[\d.]+/);
    return match ? match[0] : '';
  }
}
