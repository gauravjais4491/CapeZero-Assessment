import { test as baseTest } from '@playwright/test';
import { chromium } from '@playwright/test';
import ProductSearchPage from '@pages/productSearchPage';
import LoginPage from '@pages/loginPage';


export const test = baseTest.extend<{
  loginPage: LoginPage
  productSearchPage: ProductSearchPage
}>({
  browser: async ({ }, use) => {
    const browser = await chromium.launch()
    await use(browser)
  },
  context: async ({ browser }, use) => {
    const context = await browser.newContext()
    await use(context)
  },
  page: async ({ context }, use) => {
    const page = await context.newPage()
    await use(page)
  },
  productSearchPage: async ({ page, context }, use) => {
    await use(new ProductSearchPage(page, context))
  },
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page))
  }
})