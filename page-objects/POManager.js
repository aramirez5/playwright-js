const { LoginPage } = require('./LoginPage.js');
const { DashboardPage } = require('./DashboardPage.js');

class POManager {

  constructor(page){
    this.page = page;
    this.loginPage = new LoginPage(this.page);
    this.dashboardPage = new DashboardPage(this.page);
  }

  getLoginPage(){
    return this.loginPage;
  }

  getDashboardPage(){
    return this.dashboardPage;
  }
}

module.exports = { POManager };