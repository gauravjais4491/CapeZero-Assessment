import { test } from '@fixtures/loginPage-fixtures';
import { loginData } from '@data/loginData';


test('Validate Login Functionality on Amazon Application',
  {
    tag: ['@smoke']
  },
  async ({ loginPage }) => {
    await test.step(`Navigate to Application`, async () => {
      await loginPage.navigateToURL();
    });

    await test.step(`Login to Amazon application`, async () => {
      await loginPage.loginToApplication(loginData.email, loginData.password, loginData.delay)
    });

    await test.step(`Verify User is logged in`, async () => {
      await loginPage.verifyUserLoginSuccessful(loginData.expectedUserName)
    });
    await test.step('Store Session Cookie', async () => {
      await loginPage.saveSessionCookies()
    })
  })
