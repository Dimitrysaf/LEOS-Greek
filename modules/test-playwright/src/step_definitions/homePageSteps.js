const {Then} = require("@cucumber/cucumber");
const {expect} = require("../../src/support/timeout.js");
const HomePage =  require("../pages/homePage.js");

Then(/^user is on home page$/, async function () {
    const homePage = new HomePage(this.page);
    const actualLabel = await homePage.getEUILabel();
    expect(actualLabel.trim()).toBe("The online collaboration tool for drafting legislation");
});

// Then(/^upload act button is not present$/, function () {
//
// });
//
// When(/^click on view all acts button$/, function () {
//
// });