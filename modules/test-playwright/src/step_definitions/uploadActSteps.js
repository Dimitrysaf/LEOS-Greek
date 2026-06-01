const {When, Then, Given} = require("@cucumber/cucumber");

When(/^upload a leg file from a relative location "([^"]*)"$/, async function (legFilePath) {
    await this.page.setInputFiles('input.file-input', legFilePath);
});
Given(/^document title input field is displayed$/, function () {

});
When(/^click on create button in upload document page$/, async function () {
    await this.page.locator('app-proposal-upload-wizard .app-dialog-footer-content button.eui-button.eui-button--primary').click();
});