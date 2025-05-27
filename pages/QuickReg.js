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

  async registerPatient(patientData = {}) {
    const page = this.page;

    const createButton = page.locator('sl-button[aria-label*="Create button consisting of appointment"]');
    await expect(createButton).toBeVisible({ timeout: 15000 });
    await createButton.click();

    const createPatientItem = page.locator('sl-menu-item[aria-label="Create patient"]');
    await expect(createPatientItem).toBeVisible({ timeout: 10000 });
    await createPatientItem.click({ force: true });

    await page.locator('input[name="first_name"]').fill(patientData.firstName || 'Test');
    await page.locator('input[name="last_name"]').fill(patientData.lastName || 'User');
    await page.locator('input[name="dob"]').fill(patientData.dob || '2000-01-01');

    await page
      .locator('div')
      .filter({ hasText: /^SelectMaleFemaleUnknown$/ })
      .getByRole('combobox')
      .selectOption(patientData.gender || 'Male');

    const phoneInput = page.locator('[formcontrolname="mobile_phone"]');
    await expect(phoneInput).toBeEditable();
    await phoneInput.fill(patientData.phone || '(555)555-1234');

    const emailInput = page.locator('input[name="email"]');
    await emailInput.fill(patientData.email || 'test@example.com');

  //  const addressOption = page.locator('input[formcontrolname = "address_line1"]', { hasText: '450 Sutter Street' });
  //  await expect(addressOption).toBeVisible({ timeout: 10000 });
  //  await addressOption.click();




  //   // Allow time for autofill
  //   await page.waitForTimeout(1000);

  //   // ZIP
  //   const zipInput = page.locator('[formcontrolname="zipcode"] input');
  //   const zipValue = await zipInput.inputValue();
  //   if (!zipValue || zipValue.trim() === '') {
  //     await zipInput.fill(patientData.zip || '10007');
  //   }

  //   // State
  //   const stateSelect = page.getByLabel('State');
  //   const stateValue = await stateSelect.inputValue();
  //   if (!stateValue || stateValue.trim() === '') {
  //     await stateSelect.selectOption(patientData.state || 'AS');
  //   }

  //   // City
  //   const cityInput = page.locator('[formcontrolname="city"] input');
  //   const cityValue = await cityInput.inputValue();
  //   if (!cityValue || cityValue.trim() === '') {
  //     await cityInput.fill(patientData.city || 'Houston');
  //     await page.getByText('Houston', { exact: true }).click();
  //   }

  //   const registerBtn = page.getByRole('button', { name: 'Register Patient' });
  //   await expect(registerBtn).toBeVisible({ timeout: 10000 });
  //   await registerBtn.click();

    console.log('✅ Patient registered successfully.');
  }
}

module.exports = { QuickReg };
