const { test, expect } = require('@playwright/test');


test('Security test request intercept', async ({ page }) => {

  // LOGIN
  await page.goto("https://rahulshettyacademy.com/client");
  await page.locator("#userEmail").fill("pmdzjbrgbhwnkescia@tpwlb.com");
  await page.locator("#userPassword").fill("Iamking@000");
  await page.locator("[value='Login']").click();
  await page.waitForLoadState('networkidle');
  await page.locator(".card-body b").first().waitFor();

  // INTERCEPT NETWORK ORDERS REQUEST
  await page.locator("button[routerlink*='myorders']").click();
  await page.route("https://rahulshettyacademy.com/api/ecom/order/get-orders-details?id=*",
    route => route.continue({ url: 'https://rahulshettyacademy.com/api/ecom/order/get-orders-details?id=621661f884b053f6765465b6' }))
  await page.locator("button:has-text('View')").first().click();
  await expect(page.locator("p").last()).toHaveText("You are not authorize to view this order");
})