import { test as baseTest } from '@playwright/test';
import { chromium } from '@playwright/test';
import LoginPage from '@pages/loginPage';
export const test = baseTest.extend<{
    loginPage: LoginPage
}>({
    browser: async ({ }, use) => {
        const browser = await chromium.launch()
        await use(browser)
    },
    context: async ({ browser }, use) => {
        const context = await browser.newContext()
        await context.clearCookies()
        await use(context)
    },
    page: async ({ context }, use) => {
        const page = await context.newPage()
        await use(page)
    },
    loginPage: async ({ page }, use) => {
        await use(new LoginPage(page))
    }
})