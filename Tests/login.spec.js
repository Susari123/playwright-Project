const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');

const loginData = [
  {
    email: 'edvakhealth@ehr.com',
    password: 'Edvak@123456',
  },
];

// Declare describe block once
test.describe('Edvak EHR Login Tests', () => {
  for (const { email, password } of loginData) {
    test(`Login test for ${email}`, async ({ page }) => {
      const loginPage = new LoginPage(page);

      // Go to login page
      await page.goto('https://ehr.edvak.com/auth/login');

      // Validate logo
      await expect(page.locator('img[alt="Edvak logo"]')).toBeVisible();

      // Perform login
      await loginPage.login(email, password);

      // Optional: Wait and open user menu
      await page.waitForTimeout(5000);
      await loginPage.openUserMenu();
    });
  }
});
