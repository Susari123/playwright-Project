# Test info

- Name: Encounter Notes EHR Registration Tests >> EncounterNotes for the patient edvakhealth@ehr.com
- Location: C:\Users\sksusari\git\playwright-Project\Tests\EncounterNote.spec.js:13:5

# Error details

```
Error: page.goto: net::ERR_ABORTED; maybe frame was detached?
Call log:
  - navigating to "https://ehr.edvak.com/auth/login", waiting until "load"

    at C:\Users\sksusari\git\playwright-Project\Tests\EncounterNote.spec.js:17:20
```

# Test source

```ts
   1 | const { test, expect } = require('@playwright/test');
   2 | const { EncounterNotes } = require('../pages/EncounterNotes');  
   3 |
   4 | const loginData = [
   5 |   {
   6 |     email: 'edvakhealth@ehr.com',
   7 |     password: 'Edvak@123456',
   8 |   },
   9 | ];
  10 |
  11 | test.describe('Encounter Notes EHR Registration Tests', () => {
  12 |   for (const { email, password } of loginData) {
  13 |     test(`EncounterNotes for the patient ${email}`, async ({ page }) => {
  14 |       const encounterNotes = new EncounterNotes(page);  
  15 |
  16 |       try {
> 17 |         await page.goto('https://ehr.edvak.com/auth/login', { timeout: 60000 }); 
     |                    ^ Error: page.goto: net::ERR_ABORTED; maybe frame was detached?
  18 |         await encounterNotes.performLogin(email, password); 
  19 |         await page.waitForTimeout(4000);  
  20 |         await encounterNotes.encounterNote();
  21 |       } catch (error) {
  22 |         console.error('Test failed with error:', error);
  23 |         throw error;
  24 |       }
  25 |     });
  26 |   }
  27 | });
  28 |
```