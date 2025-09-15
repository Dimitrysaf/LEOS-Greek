import { When, Then } from "@badeball/cypress-cucumber-preprocessor";
require('@cypress/xpath');
import createActPage from "../pages/createActPage";

Then('user is on create new legislative document window', () => {
    createActPage.elements.dialogHeader().should('be.visible');
})
 
When('click on template {string} in create new legislative document window', (templateName) => {
    createActPage.clickTemplateByName(templateName);
})

When('click on next button in create document page', () => {
    createActPage.clickNextBtn();
})

When('provide document title {string} in create document page', (title) => {
    createActPage.enterProposalTitle(title);
})

When('click on create button', () => {
    createActPage.clickCreateBtn();
})

Then(/^collapse all button is displayed in create new legislative document window$/, function () {
    createActPage.elements.collapseAllBtn().should('be.visible');
});