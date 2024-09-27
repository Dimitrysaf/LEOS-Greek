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