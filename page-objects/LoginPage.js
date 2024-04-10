class LoginPage {

  constructor(page) {
    this.page = page;
    this.username = page.locator("//input[@id='userEmail']");
    this.password = page.locator("//input[@id='userPassword']");
    this.signInBtn = page.locator("//input[@id='login']");
  }

  async goTo() {
    await this.page.goto('https://rahulshettyacademy.com/client');
  }

  async validLogin(username, password) {
    await this.username.fill(username);
    await this.password.fill(password);
    await this.signInBtn.click();
  }
}

module.exports = { LoginPage };