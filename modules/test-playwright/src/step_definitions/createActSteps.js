const {When, Then} = require("@cucumber/cucumber");
const {expect} = require("../../src/support/timeout.js");

When(/^click on create act button$/, async function () {
    await this.page.locator('.hero-image button.eui-button--primary:nth-child(2)').click();
});

Then(/^user is on create new legislative document window$/, function () {

});

When(/^click on template "([^"]*)" in create new legislative document window$/, async function (templateType) {
    await this.page.locator("//label[contains(text(),'" + templateType + "')]").click();
});

When(/^click on next button in create document page$/, async function () {
    await this.page.locator('.app-dialog-footer-content button:nth-child(3)').click();
});

When(/^provide document title "([^"]*)" in create document page$/, async function (title) {
    await this.page.locator('input#docPurpose').fill(title);

});

When(/^click on create button$/, async function () {
    await this.page.locator('app-proposal-create-wizard .app-dialog-footer-content button.eui-button.eui-button--primary').click();
});

// Then(/^user can see the following templates in create new legislative document window$/, function () {
//
// });
//
// When(/^tick eea relevance in create document page$/, function () {
//
// });
When(/^tick guidance approval checkbox in create document page$/, async function () {
    await this.page.locator('input#guidanceApproval').click();
});