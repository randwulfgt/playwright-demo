import { Page } from '@playwright/test';
import { config } from '../config/env';

export class LoginPage {
  readonly page: Page;
  readonly url: string;

  constructor(page: Page, baseUrl = config.baseUrl) {
    this.page = page;
    this.url = `${baseUrl}/auth_ecommerce.html`;
  }

  /* Locators */
  get emailInput() {
    return this.page.getByPlaceholder('Enter email - insert admin@admin.com');
  }

  get passwordInput() {
    return this.page.getByPlaceholder('Enter Password - insert admin123');
  }

  get submitButton() {
    return this.page.getByRole('button', { exact: true, name: 'Submit' });
  }

  get errorMessage() {
    return this.page.getByText(
      "Bad credentials! Please try again! Make sure that you've registered."
    );
  }

  get shoppingCart() {
    return this.page.getByText('SHOPPING CART');
  }

  get logOut() {
    return this.page.getByText('Log Out');
  }

  /* Actions */
  async goto() {
    await this.page.goto(this.url, { waitUntil: 'domcontentloaded' });
  }

  async fillEmail(email: string) {
    await this.emailInput.fill(email);
  }

  async fillPassword(password: string) {
    await this.passwordInput.fill(password);
  }

  async submit() {
    await this.submitButton.click();
  }

  async login(email: string, password: string) {
    await this.fillEmail(email);
    await this.fillPassword(password);
    await this.submit();
  }

  /** Login using credentials from .env */
  async loginWithEnvCredentials() {
    await this.login(config.credentials.email, config.credentials.password);
  }
}
