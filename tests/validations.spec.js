const { test, expect } = require('@playwright/test');

test('Hide/show validation', async ({ page }) => {

  await page.goto("https://rahulshettyacademy.com/AutomationPractice/");

  // Default it is visible
  await expect(page.locator("#displayed-text")).toBeVisible();

  // Click on Hide
  await page.locator("#hide-textbox").click();
  await expect(page.locator("#displayed-text")).toBeHidden();

  // Click on Show
  await page.locator("#show-textbox").click();
  await expect(page.locator("#displayed-text")).toBeVisible();
});

test('Alert validation', async ({ page }) => {

  const textExpected = "Hello Álvaro, share this practice page and share your knowledge";

  await page.goto("https://rahulshettyacademy.com/AutomationPractice/");

  page.on('dialog', async dialog => {
    expect(dialog.message()).toBe(textExpected);
    await dialog.accept();
  });

  await page.locator("#name").fill("Álvaro");

  await page.locator("#alertbtn").click();
});

test('Iframe validation', async ({ page }) => {

  const numberExpected = "13,522";
  const iframePage = page.frameLocator("#courses-iframe");

  await page.goto("https://rahulshettyacademy.com/AutomationPractice/");
  await iframePage.locator("(//a[@href='lifetime-access'])[2]").click();
  const textCheck = await iframePage.locator(".text h2").textContent();

  expect(textCheck.split(" ")[1]).toBe(numberExpected);
});

test('Screenshot and visual comparision', async ({ page }) => {

  await page.goto("https://rahulshettyacademy.com/AutomationPractice/");

  // Default it is visible
  await expect(page.locator("#displayed-text")).toBeVisible();

  // Click on Hide
  await page.locator("#hide-textbox").click();
  await expect(page.locator("#displayed-text")).toBeHidden();
  await page.screenshot({ path: 'before.png', fullPage: true });
  await page.locator("//fieldset[contains(.,'Element Displayed Example')]").screenshot({ path: 'before-partial.png' });

  // Click on Show
  await page.locator("#show-textbox").click();
  await expect(page.locator("#displayed-text")).toBeVisible();
  await page.screenshot({ path: 'after.png', fullPage: true });
  await page.locator("//fieldset[contains(.,'Element Displayed Example')]").screenshot({ path: 'after-partial.png' });
});

test('Visual comparision', async ({ page }) => {

  await page.goto("https://rahulshettyacademy.com/AutomationPractice/");

  expect(await page.screenshot()).toMatchSnapshot('example.png');
});