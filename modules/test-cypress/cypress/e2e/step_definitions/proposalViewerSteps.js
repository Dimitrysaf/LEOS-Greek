import { Before, Given, When, And, Then } from "cypress-cucumber-preprocessor/steps";
require('@cypress/xpath');

Then('user is on proposal viewer page', () => {
    cy.get('eui-breadcrumb eui-breadcrumb-item:last-child .eui-label').should('be.visible').should("have.text", "Proposal View");
})

Then('click on legal act link present in proposal viewer page', () => {
    cy.xpath("//eui-card//eui-card-header-title//*[text()='Legal Act']").click();
    cy.wait(2000);
})