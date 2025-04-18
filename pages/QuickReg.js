const { expect } = require('@playwright/test');
const { LoginPage } = require('./LoginPage');

class QuickReg {
  constructor(page) {
    this.page = page;
  }

  async performLogin(email, password) {
    const loginPage = new LoginPage(this.page);
    await loginPage.login(email, password);
  }

  async registerPatient() {
    const page = this.page;
    await page.pause();  // Pauses to inspect and debug manually

    const createButton = page.locator('sl-button[aria-label*="Create button consisting of appointment"]');
    await expect(createButton).toBeVisible({ timeout: 60000 });
    await createButton.click();

    // Adding delay after clicking create button
    await page.waitForTimeout(2000); // Wait for 2 seconds before proceeding to the next step
  
    const createPatientItem = page.locator('sl-menu-item[aria-label="Create patient"]');
    await createPatientItem.waitFor({ state: 'visible', timeout: 10000 });
    await createPatientItem.click({ force: true });
    
    // Adding delay after clicking create patient
    await page.waitForTimeout(2000); // Wait for 2 seconds
    
    // Fill in the form...
    await page.locator('input[name="first_name"]').fill('TEst');
    await page.waitForTimeout(1000); // Wait for 1 second before filling next field
    await page.locator('input[name="last_name"]').fill('one');
    await page.waitForTimeout(1000); // Wait for 1 second

    await page.locator('input[name="dob"]').fill('2005-01-05');
    await page.waitForTimeout(1000); // Wait for 1 second
    await page
      .locator('div')
      .filter({ hasText: /^SelectMaleFemaleUnknown$/ })
      .getByRole('combobox')
      .selectOption('Male');
    await page.waitForTimeout(1000); // Wait for 1 second

    await page.locator('input[type="tel"]').fill('(564)546-54656');
    await page.waitForTimeout(1000); // Wait for 1 second
    await page.locator('input[name="email"]').fill('sksusari@edvak.com');
    await page.waitForTimeout(1000); // Wait for 1 second
    
    await page.getByRole('textbox', { name: 'Enter/Search an address' }).fill('450 Sutter Street');
    await page.waitForTimeout(2000); // Wait for 2 seconds before continuing

    // Wait for the address to appear
    await page.waitForSelector('text=450 Sutter Street', { timeout: 70000 });
    await page.waitForTimeout(2000); // Wait for 2 seconds after waiting for address to appear

    // await page.getByText('450 Sutter Street').click();
  await page.locator('input[type="\\[object HTMLInputElement\\]"]').nth(1).click();
  await page.locator('input[type="\\[object HTMLInputElement\\]"]').nth(1).fill('10007');
  await page.waitForTimeout(2000); 
  await page.getByText('10007').click(); 
  await page.waitForTimeout(2000); 
  await page.getByLabel('State').selectOption('AS');
  await page.waitForTimeout(2000); 
  await page.locator('input[type="\\[object HTMLInputElement\\]"]').first().click();
  await page.waitForTimeout(2000); 
  await page.locator('input[type="\\[object HTMLInputElement\\]"]').first().fill('houston');
  await page.waitForTimeout(2000); 
  await page.getByText('Houston', { exact: true }).click();
    // Adding delay after clicking the address
    await page.waitForTimeout(2000); // Wait for 2 seconds

    const registerBtn = page.getByRole('button', { name: 'Register Patient' });
    await expect(registerBtn).toBeVisible();
    await registerBtn.click();

    // Adding delay after clicking register button
    await page.waitForTimeout(3000); // Wait for 3 seconds before logging

    console.log("Patient registered.");
  }
}

module.exports = { QuickReg };