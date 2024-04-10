const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../page-objects/LoginPage.js');

test('Client app login', async ({ page }) => {

    const username = "pmdzjbrgbhwnkescia@tpwlb.com";
    const password = "Iamking@000";

    const loginPage = new LoginPage(page);
    loginPage.goTo();
    loginPage.validLogin(username, password);

    await page.waitForLoadState('networkidle');

    const titles = await page.locator(".card-body b").allTextContents();

    console.log(titles);
});