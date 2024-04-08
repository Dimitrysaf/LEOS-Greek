import { Before, Given, When, And, Then } from "cypress-cucumber-preprocessor/steps";
require('@cypress/xpath');

Then('user is on create new legislative document window', () => {
    cy.xpath("//div[@role='dialog']//*[text()='Create new legislative document']").should('be.visible');
})

When("click on template {string} under tree item", (templateName) => {
    cy.xpath("//*[text()='" + templateName + "']").click();
})

When('click on next button in create document page', () => {
    cy.xpath("//*[text()=' Next ']").click();
})

And('provide document title {string} in create document page', (title) => {
    cy.get('input#docPurpose').type(title);
})

And('click on create button', () => {
    cy.get('app-proposal-create-wizard button.eui-button.eui-button--primary').click();
    cy.wait(7000);
})