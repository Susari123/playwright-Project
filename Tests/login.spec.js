const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');


const loginData = [
  {
    email: 'souravsusari311@gmail.com',
    password: 'Edvak@3210',
  },
];

test.describe('Edvak EHR Login Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://darwinapi.edvak.com/auth/login');
  });

  for (const { email, password } of loginData) {
    test(`Login test for ${email}`, async ({ page }) => {
      const loginPage = new LoginPage(page);

      // Validate logo
      await expect(page.locator('img[alt="Edvak logo"]')).toBeVisible();


      // Perform login
      await loginPage.login(email, password);

    //   Wait and open user menu
      await page.waitForTimeout(5000); // Use explicit waits only if necessary
      await loginPage.openUserMenu();
      // Logout
      
      
    });
  }
});
