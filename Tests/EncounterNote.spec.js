const { test, expect } = require('@playwright/test');
const { EncounterNotes } = require('../pages/EncounterNotes');  

const loginData = [
  {
    email: 'edvakhealth@ehr.com',
    password: 'Edvak@123456',
  },
];

test.describe('Encounter Notes EHR Registration Tests', () => {
  for (const { email, password } of loginData) {
    test(`EncounterNotes for the patient ${email}`, async ({ page }) => {
      const encounterNotes = new EncounterNotes(page);  

      try {
        await page.goto('https://ehr.edvak.com/auth/login', { timeout: 60000 }); 
        await encounterNotes.performLogin(email, password); 
        await page.waitForTimeout(4000);  
        await encounterNotes.encounterNote();
      } catch (error) {
        console.error('Test failed with error:', error);
        throw error;
      }
    });
  }
});
