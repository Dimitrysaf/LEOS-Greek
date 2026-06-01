const {When, Then, Given} = require("@cucumber/cucumber");
const {expect} = require("../../src/support/timeout.js");


When(/^click enter from keyboard in edition mode$/, async function () {
    await this.page.keyboard.press('Enter');
});

When(/^click delete button from keyboard in edition mode$/, async function () {
    await this.page.keyboard.press('Delete');
});
