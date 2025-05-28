const { test, expect } = require('@playwright/test');
const { QuickReg } = require('../pages/QuickReg');

// Define test users & patient data
const loginData = [
  {
    email: 'edvakhealth@ehr.com',
    password: 'Edvak@123456',
    patient: {
      firstName: 'Sourav',
      lastName: 'Susari',
      dob: '1990-05-15',
      gender: 'Male',
      phone: '(564)546-54656',
      email: 'sksusari@edvak.com',
      address: '450 Sutter Street',
      city: 'Houston',
      zip: '10007',
      state: 'AS'
    }
  }
];

test.describe('QuickReg EHR Registration Tests', () => {
  for (const { email, password, patient } of loginData) {
    test(`QuickReg full patient registration for ${email}`, async ({ page }, testInfo) => {
      const quickReg = new QuickReg(page);

      try {
        await page.goto('https://ehr.edvak.com/auth/login');
        await quickReg.performLogin(email, password);
        await quickReg.registerPatient(patient);
      } catch (error) {
        console.error('❌ Test failed:', error);

        // Save debug info on failure
        await page.screenshot({ path: `errors/${testInfo.title}.png`, fullPage: true });
        await testInfo.attach('screenshot', {
          path: `errors/${testInfo.title}.png`,
          contentType: 'image/png',
        });

        throw error; // rethrow to mark the test as failed
      }
    });
  }
});
