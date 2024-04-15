const {test, expect} = require('@playwright/test');

test('Browser context Playwright test', async({browser}) => {

    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto('https://playwright.dev/');
    console.log(await page.title());
});

test('Page Google test', async({page}) => {

    await page.goto('https://www.google.com/');
    console.log(await page.title());
    await expect(page).toHaveTitle('Google');

    page.locator("//input[@id='username']").fill("Álvaro");
    page.locator("//input[@id='password']").fill("123456");
    page.locator("//input[@id='signInBtn']").click();
    
    console.log(await page.locator("//strong[contains(.,'Incorrect')]").textContent());
    await expect(page.locator("//strong[contains(.,'Incorrect')]").toContainText('Incorrected'));
});

test('Login Page - Incorrect credentials test', async({page}) => {

    await page.goto('https://rahulshettyacademy.com/loginpagePractise/');
    console.log(await page.title());
    await expect(page).toHaveTitle('LoginPage Practise | Rahul Shetty Academy');

    await page.locator("//input[@id='username']").fill("Álvaro");
    await page.locator("//input[@id='password']").fill("123456");
    await page.locator("//input[@id='signInBtn']").click();
    
    console.log(await page.locator("//strong[contains(.,'Incorrect')]").textContent());
    await expect(page.locator("//strong[contains(.,'Incorrect')]")).toContainText('Incorrect');
});

test('Login Page - Correct credentials test', async({page}) => {

    const username = page.locator("//input[@id='username']");
    const password = page.locator("//input[@id='password']");
    const signInBtn = page.locator("//input[@id='signInBtn']");
    const cardTitles = page.locator(".card-body a");
    
    await page.goto('https://rahulshettyacademy.com/loginpagePractise/');
    await expect(page).toHaveTitle('LoginPage Practise | Rahul Shetty Academy');

    await username.fill("rahulshettyacademy");
    await password.fill("learning");
    await Promise.all(
        [
            page.waitForNavigation(),
            await signInBtn.click()
        ]
    ) 
    
    // console.log(await cardTitles.first().textContent());
    // console.log(await cardTitles.nth(1).textContent());

    const allTitles = await cardTitles.allTextContents();
    
    console.log(allTitles);
});

test('UI Controls', async({page}) => {

    const dropdown = page.locator("//select[@class='form-control']");
    const documentLink = page.locator("//a[@href='https://rahulshettyacademy.com/documents-request']");
   
    await page.goto('https://rahulshettyacademy.com/loginpagePractise/');
    
    await dropdown.selectOption('Consultant');

    await page.locator("//span[@class='radiotextsty'][contains(.,'User')]").last().click();
    await page.locator("//button[@id='okayBtn']").click();
    await expect(page.locator("//span[@class='radiotextsty'][contains(.,'User')]").last()).toBeChecked();

    await page.locator("//input[@id='terms']").click();
    await expect(page.locator("//input[@id='terms']")).toBeChecked();
    await page.locator("//input[@id='terms']").uncheck();
    expect(await page.locator("//input[@id='terms']").isChecked()).toBeFalsy();

    await expect(documentLink).toHaveAttribute('class', 'blinkingText');
});

test('Child window handle', async({browser}) => {

    const context = await browser.newContext();
    const page = await context.newPage();
    const documentLink = page.locator("//a[@href='https://rahulshettyacademy.com/documents-request']");
    const username = page.locator("//input[@id='username']");

    await page.goto('https://rahulshettyacademy.com/loginpagePractise/');
    
    const [newPage] = await Promise.all([
        context.waitForEvent('page'),
        documentLink.click()
    ])
        
    const text = await newPage.locator("//p[contains(@class,'im-para red')]").textContent();
    console.log(text);
    const arrayText = text.split("@");
    const domain = arrayText[1].split(" ")[0];
    console.log(domain);
    await username.fill(domain);
    await page.pause();
    console.log(await username.textContent());
});