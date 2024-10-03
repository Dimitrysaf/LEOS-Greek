import { When, Then } from "cypress-cucumber-preprocessor/steps";
import homePage from "../pages/homePage";
import tableOfContent from "../pages/tableOfContent";

Then('user is on home page', () => {
    homePage.elements.euiLabel().should('have.text', 'The online collaboration tool for drafting legislation');
})

When('click on view all acts button', () => {
    homePage.clickViewAllActs();
})

When(/^click on support button$/, function () {
    homePage.clickSupportBtn();
});

Then(/^below options are displayed in support menu$/, function (datatable) {
    const actualElementList = [];
    datatable.hashes().forEach((element) => {
        actualElementList.push(element.optionList);
    });
    homePage.elements.supportOptions()
        .then(($els) => {
            return (
                Cypress.$.makeArray($els)
                    .map((el) => el.innerText)
            )
        })
        .should('deep.equal', actualElementList)
});

When(/^click on notification icon$/, function () {
    homePage.clickNotificationIcon();
});

When(/^click on language icon$/, function () {
    homePage.clickLanguageIcon();
});

Then(/^below buttons are displayed under language icon$/, function (datatable) {
    const actualElementList = [];
    datatable.hashes().forEach((element) => {
        actualElementList.push(element.ButtonName);
    });
    homePage.elements.languageOptions()
        .then(($els) => {
            return (
                Cypress.$.makeArray($els)
                    .map((el) => el.innerText)
            )
        })
        .should('deep.equal', actualElementList)
});

When(/^provide "([^"]*)" keyword in search for an act input box$/, function (keyword) {
    homePage.searchInput(keyword)
});

When(/^click search button present beside of search for an act input box$/, function () {
    homePage.clickSearchBtn();
});

Then(/^search card container is displayed$/, function () {
    homePage.elements.searchCardContainer().should('be.visible');

});

When(/^click on proposal (\d+) in search card container$/, function (proposalIndex) {
    homePage.clickProposalInSearchCardContainer(proposalIndex);
});

Then(/^total search results is displayed$/, function () {
    homePage.elements.totalSearchResults().should('be.visible');
});