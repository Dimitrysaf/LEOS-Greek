import { When, And, Then } from "cypress-cucumber-preprocessor/steps";
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

And('provide document title {string} in create document page', (title) => {
    createActPage.enterProposalTitle(title);
})

And('click on create button', () => {
    createActPage.clickCreateBtn();
})

Then(/^collapse all button is displayed in create new legislative document window$/, function () {
    createActPage.elements.collapseAllBtn().should('be.visible');
});