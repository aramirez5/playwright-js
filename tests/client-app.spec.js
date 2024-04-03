const { test, expect } = require('@playwright/test');

test('Browser context-validation error login', async ({ page }) => {

    const username = page.locator("//input[@id='userEmail']");
    const password = page.locator("//input[@id='userPassword']");
    const signInBtn = page.locator("//input[@id='login']");

    await page.goto('https://rahulshettyacademy.com/client');
    await username.fill("pmdzjbrgbhwnkescia@tpwlb.com");
    await password.fill("Iamking@000");
    await signInBtn.click();
    await page.waitForLoadState('networkidle');

    const titles = await page.locator(".card-body b").allTextContents();

    console.log(titles);
});

test('Purchase test', async ({ page }) => {

    const username = page.locator("//input[@id='userEmail']");
    const password = page.locator("//input[@id='userPassword']");
    const signInBtn = page.locator("//input[@id='login']");
    const addCartBtn = page.locator("(//button[contains(.,'Add To Cart')])[1]");
    const addCartAlert = page.locator("//div[contains(@role,'alert')]");
    const cartBtn = page.locator("//button[contains(@routerlink,'/dashboard/cart')]");
    const productName = 'ZARA COAT 3';
    const products = page.locator("(//div[contains(@class,'card-body')])");
    const count = await products.count();

    // LOGIN
    await page.goto('https://rahulshettyacademy.com/client');
    await username.fill("pmdzjbrgbhwnkescia@tpwlb.com");
    await password.fill("Iamking@000");
    await signInBtn.click();
    await page.waitForLoadState('networkidle');

    // ADD PRODUCT TO CART
    for (let i = 0; i < count; i++) {
        if (await products.nth(i).locator("b").textContent() === productName) {
            await products.nth(i).locator("text= Add To Cart").click();
            break;
        }
    }
    await page.isVisible("//b[@xpath='1']");
    await addCartBtn.click();
    await addCartAlert.click();
    await page.isVisible("//label[contains(@xpath,'1')]");
    await cartBtn.click();

    // RESUME
    await expect(page.locator("//h1[contains(.,'My Cart')]")).toContainText('My Cart');
    await expect(page.locator("//h3[contains(.,'ZARA COAT 3')]")).toContainText(productName);
    await expect(page.locator("(//p[contains(.,'$ 31500')])[2]")).toContainText('$ 31500');
    await page.locator("//button[contains(.,'Buy Now')]").click();

    // BUY FORM
    await page.locator("(//select[@class='input ddl'])[1]").selectOption("12");
    await page.locator("(//select[@class='input ddl'])[2]").selectOption("23");
    await page.locator("(//input[@type='text'])[2]").fill("666");
    await page.locator("(//input[contains(@type,'text')])[3]").fill("Álvaro");
    await page.locator("//input[contains(@placeholder,'Select Country')]").pressSequentially("Spain");
    await page.locator("//button[@type='button'][contains(.,'Spain')]").click();
    await page.locator("//input[@name='coupon']").fill("rahulshettyacademy");
    await page.locator("//a[contains(.,'Place Order')]").click();

    // ORDER SUMMARY
    await expect(page.locator(".hero-primary")).toContainText(' Thankyou for the order.');
    const orderId = await page.locator("//label[@class='ng-star-inserted']").textContent();

    // CHECK ORDER ID IN SUMMARY IS THE SAME IN DETAILS VIEW
    await page.locator("//button[@routerlink='/dashboard/myorders']").click();
    await page.locator("tbody").waitFor();
    const rows = await page.locator("tbody tr")
    for(let i=0; i<await rows.count(); i++){
        const rowOrderId = await rows.nth(i).locator("th").textContent();
        if(orderId.includes(rowOrderId)){
          await rows.nth(i).locator("button").first().click(); 
          break;   
        }
    }
    const orderIdDetails = await page.locator(".col-text").textContent();
    expect(orderId.includes(orderIdDetails)).toBeTruthy();
    
    // CLOSE BROWSER
    await page.close();
});