const { test, expect } = require('@playwright/test');
const { QuickReg } = require('../pages/QuickReg');

const loginData = [
  {
    email: 'souravsusari311@gmail.com',
    password: 'Edvak@456',
  },
];

test.describe('QuickReg EHR Registration Tests', () => {
  for (const { email, password } of loginData) {
    test(`QuickReg full patient registration for ${email}`, async ({ page }) => {
      const quickReg = new QuickReg(page);

      try {
        await page.goto('https://darwinapi.edvak.com/auth/login');
        await quickReg.performLogin(email, password);

        // await expect(page.locator('text=Dashboard')).toBeVisible();
        await quickReg.registerPatient();
      } catch (error) {
        console.error('Test failed with error:', error);
        throw error;
      }
    });
  }
});
