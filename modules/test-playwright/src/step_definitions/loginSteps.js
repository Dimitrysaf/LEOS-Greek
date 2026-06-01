const {Given, When, Then} = require("@cucumber/cucumber");
const env = require("../support/resources/config/environments/env");
const LoginPage =  require("../pages/loginPage.js");

Given("navigate to leos application with {string}", async function (user) {
    // console.log("Current environment:", env.environment);
    // console.log("Selected browser:", process.env.BROWSER);
    if(env.environment.includes("local")){
        await this.page.goto("http://" + env[user] + ":" + env.password + env.appUrl);
    }
    else{
        await this.page.goto(env.appUrl);
        const loginPage = new LoginPage(this.page);
        await loginPage.verifyUserName();
        await loginPage.enterUserName(env[user]);
        await loginPage.verifyPassword();
        await loginPage.enterPassword();
    }
});

/*
When("user enters username {string}", async function (userName) {
    const loginPage = new LoginPage(this.page);
    await loginPage.enterUserName(userName);
});

When('user clicks next button', async function () {
    const loginPage = new LoginPage(this.page);
    await loginPage.clickNextBtn();
});

Then('user is on login page', async function () {
    const loginPage = new LoginPage(this.page);
    await loginPage.verifyPassword();
});

When("user enters password {string}", async function (password) {
    const loginPage = new LoginPage(this.page);
    await loginPage.enterPassword();
});

When('user clicks on sign in button', async function () {
    const loginPage = new LoginPage(this.page);
    await loginPage.clickSignInBtn();
});

Then('user is on EU login page', async function () {
    const loginPage = new LoginPage(this.page);
    await loginPage.verifyUserName();
});
*/
