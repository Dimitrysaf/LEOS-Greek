const {When, Then} = require("@cucumber/cucumber");
const {expect} = require("../../src/support/timeout.js");

When(/^mouseover and click on article (\d+)$/, async function (articleNumber) {
    const article = this.page.locator("//article").nth(articleNumber-1);
    await article.hover({ position: { x: 5, y: 5 } });
    await article.click({ position: { x: 0, y: 0 } });
});

Then(/^user is on legal act page$/, async function () {
    await this.page.waitForTimeout(5000);
    await expect(this.page.locator('eui-breadcrumb-item span.eui-label--secondary')).toHaveText('Legal Act');
});