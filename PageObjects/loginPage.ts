import { expect, Locator, Page } from '@playwright/test'

class LoginPage {
  readonly page: Page;
  readonly EMAIL_EDIT_BOX: Locator;
  readonly PASSWORD_EDIT_BOX: Locator;
  readonly SIGN_IN_BUTTON: Locator;
  readonly USERNAME_TEXT: Locator;

  constructor(page: Page) {
    this.page = page;
    this.EMAIL_EDIT_BOX = page.locator('#ap_email_login').or(page.locator('#ap_email'));
    this.SIGN_IN_BUTTON = page.getByRole('link', { name: 'Sign in', exact: true });
    this.PASSWORD_EDIT_BOX = page.getByLabel('Password');
    this.USERNAME_TEXT = page.locator('#nav-link-accountList-nav-line-1');
  }

  async navigateToURL(): Promise<void> {
    await this.page.goto("/");
  }
  async loginToApplication(emailOrPhoneNumber: string, password: string, delayTime: number): Promise<void> {
    await this.SIGN_IN_BUTTON.click();
    await this.EMAIL_EDIT_BOX.waitFor({ state: 'visible', timeout: 5000 })
    await this.EMAIL_EDIT_BOX.pressSequentially(emailOrPhoneNumber, { delay: delayTime });
    await this.page.keyboard.press('Enter');
    await this.PASSWORD_EDIT_BOX.waitFor({ state: 'visible', timeout: 5000 })
    await this.PASSWORD_EDIT_BOX.pressSequentially(password, { delay: delayTime });
    await this.page.keyboard.press('Enter');
  }
  async verifyUserLoginSuccessful(expectedUserName: string) {
    await expect(this.USERNAME_TEXT).toContainText(expectedUserName)
  }
  async saveSessionCookies() {
    await this.page.context().storageState({ path: "./LoginAuthCQ.json" });
  }
}

export default LoginPage;
