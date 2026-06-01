const {Then, Given, When} = require("@cucumber/cucumber");

Then(/^user is on repository browser page$/, function () {

});

When(/^click on upload button$/, async function () {
    await this.page.locator('.hero-image button.eui-button--primary:nth-child(1)').click();
});