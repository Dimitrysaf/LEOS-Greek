import { When, And, Then } from "cypress-cucumber-preprocessor/steps";
require('@cypress/xpath');
import createProposalPage from "../pages/createProposalPage";

Then('user is on create new legislative document window', () => {
    createProposalPage.elements.dialogHeader().should('be.visible');
})
 
When('click on template {string} in create new legislative document window', (templateName) => {
    createProposalPage.clickTemplateByName(templateName);
})

When('click on next button in create document page', () => {
    createProposalPage.clickNextBtn();
})

And('provide document title {string} in create document page', (title) => {
    createProposalPage.enterProposalTitle(title);
})

And('click on create button', () => {
    createProposalPage.clickCreateBtn();
})

Then(/^collapse all button is displayed in create new legislative document window$/, function () {
    createProposalPage.elements.collapseAllBtn().should('be.visible');
});