const {test, expect} = require('@playwright/test');

test('Browser context-validation error login', async({page}) => {

    const username = page.locator("//input[@id='userEmail']");
    const password = page.locator("//input[@id='userPassword']");
    const signInBtn = page.locator("//input[@id='login']");

    await page.goto('https://rahulshettyacademy.com/client');

    await username.type("pmdzjbrgbhwnkescia@tpwlb.com");
    await password.type("Iamking@000");
    await signInBtn.click();
    await page.waitForLoadState('networkidle');

    const titles = await page.locator(".card-body b").allTextContents();

    console.log(titles);

});
