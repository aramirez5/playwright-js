const { test, expect, request } = require('@playwright/test');
const { APIUtils } = require('./utils/APIUtils');
const loginPayload = { userEmail: "pmdzjbrgbhwnkescia@tpwlb.com", userPassword: "Iamking@000" }
const orderPayload = { orders: [{ country: "Spain", productOrderedId: "6581ca399fd99c85e8ee7f45" }] }
let response;

test.beforeAll(async () => {
  const apiContext = await request.newContext();
  const apiUtils = new APIUtils(apiContext, loginPayload);
  response = await apiUtils.createOrder(orderPayload);
});

test('Api login', async ({ page }) => {

  page.addInitScript(value => {
    window.localStorage.setItem('token', value);
  }, response.token);

  await page.goto('https://rahulshettyacademy.com/client');

  const titles = await page.locator(".card-body b").allTextContents();

  console.log(titles);
});

test('Api purchase', async ({ page }) => {

  // LOGIN
  page.addInitScript(value => {
    window.localStorage.setItem('token', value);
  }, response.token);

  await page.goto('https://rahulshettyacademy.com/client');

  // CHECK ORDER ID IN SUMMARY IS THE SAME IN DETAILS VIEW
  await page.locator("//button[@routerlink='/dashboard/myorders']").click();
  await page.locator("tbody").waitFor();
  const rows = await page.locator("tbody tr")
  for (let i = 0; i < await rows.count(); i++) {
    const rowOrderId = await rows.nth(i).locator("th").textContent();
    if (response.orderId.includes(rowOrderId)) {
      await rows.nth(i).locator("button").first().click();
      break;
    }
  }
  const orderIdDetails = await page.locator(".col-text").textContent();
  expect(response.orderId.includes(orderIdDetails)).toBeTruthy();

  // CLOSE BROWSER
  await page.close();
});