const { expect } = require('@playwright/test');
const { LoginPage } = require('./LoginPage');

class EncounterNotes {
  constructor(page) {
    this.page = page;
  }

  logStep(message) {
    const now = new Date().toISOString().replace('T', ' ').split('.')[0];
    console.log(`\x1b[2m[${now}]\x1b[0m \x1b[1m\x1b[36m[Step] ${message}\x1b[0m`);
  }

  getCurrentDateString() {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }

  async retry(actionFn, retries = 3, delay = 1000) {
    for (let i = 0; i < retries; i++) {
      try {
        return await actionFn();
      } catch (error) {
        if (i === retries - 1) throw error;
        await this.page.waitForTimeout(delay);
      }
    }
  }

  async performLogin(email, password) {
    const loginPage = new LoginPage(this.page);
    await this.retry(() => loginPage.login(email, password));
  }

  async safeClick(xpath) {
    await this.retry(async () => {
      const el = this.page.locator(xpath);
      await el.waitFor({ state: 'attached', timeout: 15000 });
      await expect(el).toBeVisible({ timeout: 15000 });
      await expect(el).toBeEnabled({ timeout: 15000 });
      await el.scrollIntoViewIfNeeded();
      await el.click();
    });
  }

  async selectNoteType(noteTypeText) {
    const dropdownItems = this.page.locator("//button[contains(@class, 'notetypedropdown')]");
    const seen = new Set();
    let lastSeenCount = 0;

    for (let scroll = 0; scroll < 25; scroll++) {
      const count = await dropdownItems.count();

      for (let i = 0; i < count; i++) {
        const item = dropdownItems.nth(i);
        const text = (await item.innerText()).trim();

        if (!seen.has(text)) seen.add(text);

        if (text.toLowerCase().includes(noteTypeText.toLowerCase())) {
          await item.scrollIntoViewIfNeeded();
          await item.click();
          return;
        }
      }

      if (seen.size === lastSeenCount) break;
      lastSeenCount = seen.size;

      await this.page.evaluate(() => {
        const dropdown = document.querySelector('sl-dropdown');
        const scrollArea = dropdown?.shadowRoot?.querySelector('.overflow-y-auto');
        scrollArea?.scrollBy(0, 300);
      });

      await this.page.waitForTimeout(500);
    }

    const screenshotPath = `notetype-not-found-${Date.now()}.png`;
    await this.page.screenshot({ path: screenshotPath });
    throw new Error(`❌ Note type "${noteTypeText}" not found. Screenshot: ${screenshotPath}`);
  }

  async selectRandomOptionFromDropdown(dropdownLocator, label) {
    await this.logStep(`🔄 Selecting random option from: ${label}`);
    await dropdownLocator.waitFor({ state: 'visible', timeout: 10000 });

    const options = await dropdownLocator.locator('option').all();
    const validOptions = [];

    for (const option of options) {
      const value = await option.getAttribute('value');
      const text = await option.textContent();
      if (value && value.trim() !== '' && !value.includes('null') && text?.trim().toLowerCase() !== 'select') {
        validOptions.push(value);
      }
    }

    if (validOptions.length === 0) {
      const screenshot = `dropdown-empty-${label}-${Date.now()}.png`;
      await this.page.screenshot({ path: screenshot });
      throw new Error(`❌ No valid options in dropdown: ${label}. Screenshot: ${screenshot}`);
    }

    const randomValue = validOptions[Math.floor(Math.random() * validOptions.length)];
    await dropdownLocator.selectOption(randomValue);
    this.logStep(`✅ Selected [${label}]: ${randomValue}`);
  }

  async encounterNote() {
    const page = this.page;

    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(9000);

    await this.safeClick("//button[@aria-label = 'User profile']");
    const roleText = (await page.locator("span.font-semibold.mb-sm.fs-md").textContent()).trim();
    const location = (await page.locator("span.text-primary-base.ng-tns-c331-3").textContent()).trim();
    this.logStep(`👤 Role: ${roleText}, 🌍 Location: ${location}`);

    await this.safeClick("//sl-icon[@name = 'patient_list']");
    await page.waitForTimeout(9000);
    await this.safeClick("//tbody[1]/tr[2]");
    await page.waitForTimeout(9000);

    await page.waitForSelector("//div[contains(text(), ' Encounter Notes ')]", { timeout: 10000 });
    this.logStep('Clicking on Encounter Notes tab...');
    await this.safeClick("//div[contains(text(), ' Encounter Notes ')]");

    await page.waitForTimeout(15000);
    this.logStep('Clicking on Create New...');
    await this.safeClick("//sl-button[contains(text(), ' Create New ')]");

    await page.waitForTimeout(9000);
    this.logStep('NoteType Selection...');
    await page.waitForSelector("//button[contains(@class, 'notetypedropdown')]", { timeout: 10000 });
    await this.retry(() => this.selectNoteType("Print Notes"));

    await page.waitForTimeout(4000);
    this.logStep('Clicking on Create New Encounter...');
    await this.safeClick("//sl-button[contains(text(), ' Create New Encounter ')]");

    await page.waitForTimeout(4000);
    this.logStep('Filling Date...');
    const dateInput = page.locator("//input[@type = 'date']");
    await dateInput.waitFor({ state: 'visible', timeout: 10000 });
    await dateInput.fill(this.getCurrentDateString());

    this.logStep('Setting Provider...');
    await page.locator("//label[text()='Provider']/following-sibling::select").selectOption({ label: roleText });

    this.logStep('Setting Location...');
    await page.locator("//label[text()='Location']/following-sibling::select").selectOption({ label: location });

    this.logStep('Selecting random Visit Type...');
    await this.selectRandomOptionFromDropdown(
      page.locator("//label[text()='Visit Type']/following-sibling::select"),
      'Visit Type'
    );

    this.logStep('Clicking Create Note button...');
    await this.safeClick("//sl-button[contains(text(), ' Create Note ')]");

    await page.waitForTimeout(15000);
    const composeBtn = page.locator("//sl-button[contains(text(), ' Compose with Darwin ')]");
    if (await composeBtn.isVisible({ timeout: 10000 })) {
      await composeBtn.click();
      this.logStep('Compose with Darwin clicked');
    }

    await page.locator("//app-ai-chat-footer//textarea").fill("Patient is suffering from cholera");
    await this.safeClick("//sl-button[contains(text(),'Convert to Encounter Notes')]");
    await page.pause(); // For debug only
  }
}

module.exports = { EncounterNotes };
