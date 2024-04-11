const ExcelJs = require('exceljs');
const { test, expect } = require('@playwright/test');

async function writeExcelTest(searchText, replaceText, change, filePath) {

  const workbook = new ExcelJs.Workbook();
  await workbook.xlsx.readFile(filePath);
  const worksheet = workbook.getWorksheet('Sheet1');
  const output = await readExcel(worksheet, searchText);

  const cell = worksheet.getCell(output.row, output.column + change.colChange);
  cell.value = replaceText;
  await workbook.xlsx.writeFile(filePath);
}

async function readExcel(worksheet, searchText) {

  let output = { row: -1, column: -1 };

  worksheet.eachRow((row, rowNumber) => {
    row.eachCell((cell, colNumber) => {
      if (cell.value === searchText) {
        output.row = rowNumber;
        output.column = colNumber;
      }
    })
  })
  return output;
}

test('Upload and download excel validation', async ({ page }) => {
  
  // CREATE EXPECTED DATA
  const textSearch = 'Mango';
  const updateValue = '350';

  // GO TO URL
  await page.goto("https://rahulshettyacademy.com/upload-download-test/index.html");
  
  // WAIT UNTIL DOWNLOAD TO CLICK ON IT
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download' }).click();
  await downloadPromise;
  
  //UPDATE THE EXCEL FILE
  writeExcelTest(textSearch, updateValue, { rowChange: 0, colChange: 2 }, "resources/download.xlsx");
  
  //UPLOAD THE FILE
  await page.locator("#fileinput").click();
  await page.locator("#fileinput").setInputFiles("resources/download.xlsx");
  
  // CHECK THE UPDATED VALUE IS SHOWN IN THE WEBSITE
  const textlocator = page.getByText(textSearch);
  const desiredRow = await page.getByRole('row').filter({ has: textlocator });
  await expect(desiredRow.locator("#cell-4-undefined")).toContainText(updateValue);
})
