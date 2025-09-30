import { When, Then } from "@badeball/cypress-cucumber-preprocessor";
require('@cypress/xpath');
import createActPage from "../pages/createActPage";

Then('user is on create new legislative document window', () => {
    createActPage.elements.dialogHeader().should('be.visible');
})
 
When('click on template {string} in create new legislative document window', function (templateName) {
    createActPage.clickTemplateByName(templateName);
})

When('click on next button in create document page', () => {
    createActPage.clickNextBtn();
})

When('provide document title {string} in create document page', function(title) {
    createActPage.enterProposalTitle(title);
})

When('click on create button', () => {
    createActPage.clickCreateBtn();
})

Then(/^collapse all button is displayed in create new legislative document window$/, function () {
    createActPage.elements.collapseAllBtn().should('be.visible');
});

When(/^tick eea relevance in create document page$/, function () {
    createActPage.clickEEARelevanceInputCheckBox();
});

Then("user can see the following templates in create new legislative document window",function(datatable) {
    const actualOptionList = datatable.hashes().map(el => el.templateName);
    createActPage.elements.templateList()
        .then($els =>
            Cypress.$.makeArray($els)
                .map(el => el.innerText.replace(/\s+/g, ' ').trim())
                .filter(name => name.startsWith("SJ"))
        )
        .should('deep.equal', actualOptionList.map(name => name.replace(/\s+/g, ' ').trim()));
});