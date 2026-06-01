const {When, Then} = require("@cucumber/cucumber");
const {expect} = require("../../src/support/timeout.js");

Then(/^user is on act view page$/, async function () {
    await expect(this.page.locator('eui-breadcrumb-item span.eui-label--secondary')).toHaveText('Act View');
})

When(/^click on add button in annexes section$/, async function () {
    await this.page.locator("//*[text()='Annexes']/ancestor::div[contains(@class,'eui-u-pt-m')]//*[text()=' Add ']").click();
});

Then(/^total number of annexes present in act viewer page is (\d+)$/, async function (count) {
    await expect(this.page.locator('eui-card .eui-card-content table tbody tr')).toHaveCount(count, { timeout: 10000 });
});

When(/^click on close button on act viewer page$/, function () {

});

When(/^click on legal act link present in act viewer page$/, async function () {
    await this.page.locator("//*[text()='Legal Act']").click();
});

When(/^click on annex in another format option$/, async function () {
    await Promise.all([
        this.page.waitForEvent('filechooser').then(fc =>
            fc.setFiles('src/fixtures/pdfFiles/ExtentReport.pdf')
        ),
        await this.page.locator('button:nth-child(2) div.eui-dropdown-item__content-text').click()
    ]);
});