import { Before, Given, When, And, Then } from "cypress-cucumber-preprocessor/steps";
require('@cypress/xpath');
import createProposalPage from "../pages/createProposalPage";

Then('user is on create new legislative document window', () => {
    createProposalPage.elements.dialogHeader().should('be.visible');
})

When("click on template {string} in create new legislative document window", (templateName) => {
    createProposalPage.getTemplateElementByName(templateName).click();
})

When('click on next button in create document page', () => {
    createProposalPage.elements.nextBtn().click();
})

And('provide document title {string} in create document page', (title) => {
    createProposalPage.elements.documentTitle().clear().type(title);
})

And('click on create button', () => {
    createProposalPage.elements.createBtn().click();
    cy.wait(2000);
})