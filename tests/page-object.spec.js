const { test, expect } = require('@playwright/test');
const { customtest } = require('../utils/OrderFixture.js');
const { POManager } = require('../page-objects/POManager.js');
const dataSet = JSON.parse(JSON.stringify(require('../utils/OrderData.json')));

test('Client app login', async ({ page }) => {

  const poManager = new POManager(page);

  const username = "pmdzjbrgbhwnkescia@tpwlb.com";
  const password = "Iamking@000";

  const loginPage = poManager.getLoginPage();
  await loginPage.goTo();
  await loginPage.validLogin(dataSet.username, dataSet.password);

  const titles = await page.locator(".card-body b").allTextContents();

  console.log(titles);
});

for (const data of dataSet) {
  test(`Purchase test ${data.productName}`, async ({ page }) => {

    const poManager = new POManager(page);

    const username = "pmdzjbrgbhwnkescia@tpwlb.com";
    const password = "Iamking@000";
    const addCartAlert = page.locator("//div[contains(@role,'alert')]");
    const cartBtn = page.locator("//button[contains(@routerlink,'/dashboard/cart')]");
    const productName = 'ZARA COAT 3';

    const loginPage = poManager.getLoginPage();
    await loginPage.goTo();
    await loginPage.validLogin(dataSet.username, data.password);

    const dashboardPage = poManager.getDashboardPage();
    await dashboardPage.searchProductAndAddToCart(data.productName);
    await dashboardPage.navigateToCart();

    await page.isVisible("//b[@xpath='1']");
    await addCartAlert.click();
    await page.isVisible("//label[contains(@xpath,'1')]");
    await cartBtn.click();

    // RESUME
    await expect(page.locator("//h1[contains(.,'My Cart')]")).toContainText('My Cart');
    await expect(page.locator("//h3[contains(.,'ZARA COAT 3')]")).toContainText(data.productName);
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
    for (let i = 0; i < await rows.count(); i++) {
      const rowOrderId = await rows.nth(i).locator("th").textContent();
      if (orderId.includes(rowOrderId)) {
        await rows.nth(i).locator("button").first().click();
        break;
      }
    }
    const orderIdDetails = await page.locator(".col-text").textContent();
    expect(orderId.includes(orderIdDetails)).toBeTruthy();

    // CLOSE BROWSER
    await page.close();
  });

  customtest(`Purchase customtest ${data.productName}`, async ({ page, testDataOrder }) => {

    const poManager = new POManager(page);

    const addCartAlert = page.locator("//div[contains(@role,'alert')]");
    const cartBtn = page.locator("//button[contains(@routerlink,'/dashboard/cart')]");
  
    const loginPage = poManager.getLoginPage();
    await loginPage.goTo();
    await loginPage.validLogin(testDataOrder.username, testDataOrder.password);
  
    const dashboardPage = poManager.getDashboardPage();
    await dashboardPage.searchProductAndAddToCart(testDataOrder.productName);
    await dashboardPage.navigateToCart();
  
    await page.isVisible("//b[@xpath='1']");
    await addCartAlert.click();
    await page.isVisible("//label[contains(@xpath,'1')]");
    await cartBtn.click();
  
    // RESUME
    await expect(page.locator("//h1[contains(.,'My Cart')]")).toContainText('My Cart');
    await expect(page.locator("//h3[contains(.,'ZARA COAT 3')]")).toContainText(testDataOrder.productName);
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
    for (let i = 0; i < await rows.count(); i++) {
      const rowOrderId = await rows.nth(i).locator("th").textContent();
      if (orderId.includes(rowOrderId)) {
        await rows.nth(i).locator("button").first().click();
        break;
      }
    }
    const orderIdDetails = await page.locator(".col-text").textContent();
    expect(orderId.includes(orderIdDetails)).toBeTruthy();
  
    // CLOSE BROWSER
    await page.close();
  });
}

