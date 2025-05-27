// Page Object for the login page
class LoginPage {
    /**
     * @param {import('@playwright/test').Page} page
     */
    constructor(page) {
      this.page = page;
      this.emailInput = page.locator('input[placeholder="Email address"]');
      this.passwordInput = page.locator('input[placeholder="Password"]');
      this.loginButton = page.locator('#content-area > app-login > section > div > div > form > div.text-center.mb-3 > sl-button'); 
      this.userIcon = page.locator('#Logout-container > button');
      this.logoutButton = page.locator('text=Logout');
      this.edvakLogo = page.locator('img.w-52.mb-md');
    }
  
    async goto(url) {
      await this.page.goto(url);
    }
  
    async isLoginLogoVisible() {
        await this.page.waitForSelector('img[alt="Edvak logo"]', { timeout: 60000 });
        return await this.page.locator('img[alt="Edvak logo"]').isVisible();
      }
  
      async login(email, password) {
        await this.emailInput.fill(email);
        await this.passwordInput.fill(password);
      
       
        await this.page.getByRole('button', { name: 'Login' }).click();
      }
  
    async openUserMenu() {
      await this.userIcon.click();
    }
  
    async logout() {
        await this.logoutButton.waitFor({ state: 'visible' }); // Ensure it's visible
  await this.logoutButton.scrollIntoViewIfNeeded(); // Scroll if needed
  await this.logoutButton.click({ force: true }); // Click the button, even if it's blocked by other elements
    }
  }
  
  module.exports = { LoginPage };
  