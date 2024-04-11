const base = require('@playwright/test');

exports.customtest = base.test.extend({
  testDataOrder: {
    username: "pmdzjbrgbhwnkescia@tpwlb.com",
    password: "Iamking@000",
    productName: "ZARA COAT 3"
  }
})