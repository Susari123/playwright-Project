const { expect } = require('@playwright/test');
const { LoginPage } = require('./LoginPage');
const fs = require('fs');

class EncounterNotes {
    constructor(page) {
        this.page = page;
    }

    // Get today's date in YYYY-MM-DD format for <input type="date">
    getCurrentDateString() {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    async performLogin(email, password) {
        const loginPage = new LoginPage(this.page);
        await loginPage.login(email, password);
    }

    async safeClick(xpath) {
        const el = this.page.locator(xpath);
        await expect(el).toBeVisible({ timeout: 30000 });
        await el.click();
    }

    // Scroll-aware note type selector (handles Shadow DOM dropdown scrolling)
    async selectNoteType(noteTypeText) {
        const page = this.page;
        const itemSelector = "//button[contains(@class, 'notetypedropdown')]";
        const dropdownItems = page.locator(itemSelector);

        const seen = new Set();
        let lastSeenCount = 0;
        const maxScrolls = 25;

        for (let scroll = 0; scroll < maxScrolls; scroll++) {
            const count = await dropdownItems.count();

            for (let i = 0; i < count; i++) {
                const item = dropdownItems.nth(i);
                const rawText = await item.innerText();
                const text = rawText.replace(/\s+/g, ' ').trim();

                if (!seen.has(text)) {
                    console.log(`Note type ${i}: "${text}"`);
                    seen.add(text);
                }

                if (text.toLowerCase().includes(noteTypeText.toLowerCase())) {
                    console.log(`✅ Clicking: "${text}"`);
                    await item.scrollIntoViewIfNeeded();
                    await item.click();
                    return;
                }
            }

            if (seen.size === lastSeenCount) {
                console.log("🔁 No new items loaded on scroll, stopping.");
                break;
            }

            lastSeenCount = seen.size;

            // ✅ Shadow DOM scroll
            await page.evaluate(() => {
                const dropdown = document.querySelector('sl-dropdown');
                const scrollArea = dropdown?.shadowRoot?.querySelector('.overflow-y-auto');
                if (scrollArea) {
                    scrollArea.scrollBy(0, 300);
                    console.log("Scrolled dropdown inside shadow DOM.");
                }
            });

            // ✅ Log scroll position for debug
            const scrollTop = await page.evaluate(() => {
                const dropdown = document.querySelector('sl-dropdown');
                const scrollArea = dropdown?.shadowRoot?.querySelector('.overflow-y-auto');
                return scrollArea?.scrollTop;
            });
            console.log("📜 Current scroll position:", scrollTop);

            await page.waitForTimeout(500);
        }

        const screenshotPath = `notetype-not-found-${Date.now()}.png`;
        await page.screenshot({ path: screenshotPath });
        throw new Error(`❌ Note type "${noteTypeText}" not found after scrolling. Screenshot: ${screenshotPath}`);
    }

    // Main flow to create encounter note
    async encounterNote(patientData = {}) {
        const page = this.page;

        await this.safeClick("//sl-icon[@name = 'patient_list']");
        await this.safeClick("//tbody[1]/tr[2]");
        await this.safeClick("//div[contains(text(), ' Encounter Notes ')]");
        await this.safeClick("//sl-button[contains(text(), ' Create New ')]");

        await page.waitForTimeout(1000); // Let dropdown appear

        try {
            await this.selectNoteType("Print Notes");
        } catch (err) {
            console.error("Failed to select note type:", err.message);
            throw err;
        }

        await this.safeClick("//sl-button[contains(text(), ' Create New Encounter ')]");

        const currentDate = this.getCurrentDateString();
        const dateInput = page.locator("//input[@type = 'date']");
        await expect(dateInput).toBeVisible({ timeout: 5000 });
        await dateInput.fill(currentDate);
        // ✅ Select from dropdown
        const dropdown = page.locator('select').nth(0).safeClick(); // adjust selector if needed
        await expect(dropdown).toBeVisible({ timeout: 5000 });
        await dropdown.selectOption({ label: 'Robert William' });

        // ✅ Verify selected option
        const selectedText = await dropdown.evaluate(el => el.options[el.selectedIndex].text);
        console.log(`✅ Selected: ${selectedText}`);
        expect(selectedText).toBe('Robert William');
 
        await page.pause(); // For manual inspection or debugging
    }
}

module.exports = { EncounterNotes };
