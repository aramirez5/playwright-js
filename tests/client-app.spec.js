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

test.only('Purchase test', async({page}) => {

    const username = page.locator("//input[@id='userEmail']");
    const password = page.locator("//input[@id='userPassword']");
    const signInBtn = page.locator("//input[@id='login']");

    await page.goto('https://rahulshettyacademy.com/client');

    await username.type("pmdzjbrgbhwnkescia@tpwlb.com");
    await password.type("Iamking@000");
    await signInBtn.click();

    await page.waitForLoadState('networkidle');
    
    const addCartBtn = page.locator("(//button[contains(.,'Add To Cart')])[1]");
    const addCartAlert = page.locator("//div[contains(@role,'alert')]");
    const cartBtn = page.locator("//button[contains(@routerlink,'/dashboard/cart')]");
    
    await page.isVisible("//b[@xpath='1']");
    await addCartBtn.click();
    await addCartAlert.click();
    await page.isVisible("//label[contains(@xpath,'1')]");
    await cartBtn.click();


    await expect(page.locator("//h1[contains(.,'My Cart')]")).toContainText('My Cart');
    await expect(page.locator("//h3[contains(.,'zara coat 3')]")).toContainText('zara coat 3');
    await expect(page.locator("(//p[contains(.,'$ 31500')])[2]")).toContainText('$ 31500');
});