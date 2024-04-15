const { When, Then, Given } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');
const { POManager } = require('../../page-objects/POManager');
const playwright = require('@playwright/test');

Given('a login to ecommerce application with {string} and {string}', {timeout : 100*1000},  async function (username, password) {

  const loginPage = this.poManager.getLoginPage();

  await loginPage.goTo();
  await loginPage.validLogin(username, password);
});

When('add {string} to cart', async function (productName) {

  this.dashboardPage = this.poManager.getDashboardPage();
  await this.dashboardPage.searchProductAndAddToCart(productName);
  await this.dashboardPage.navigateToCart();
});

Then('verify {string} is displayed in the cart', async function (productName) {

  const cartPage = this.poManager.getCartPage();
  await cartPage.verifyProductIsDisplayed(productName);
  await cartPage.checkout();
});

When('enter valid details and place the order', async function () {

  const ordersReviewPage = this.poManager.getOrdersReviewPage();
  await ordersReviewPage.searchCountryAndSelect("ind", "India");
  this.orderId = await ordersReviewPage.submitAndGetOrderId();
  console.log(this.orderId);
});

Then('verify order in present in the order history', async function () {

  await this.dashboardPage.navigateToOrders();
  const ordersHistoryPage = this.poManager.getOrdersHistoryPage();
  await ordersHistoryPage.searchOrderAndSelect(this.orderId);
  expect(this.orderId.includes(await ordersHistoryPage.getOrderId())).toBeTruthy();
});