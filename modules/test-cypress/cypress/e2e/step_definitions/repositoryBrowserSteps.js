import { Before, Given, When, And, Then } from "cypress-cucumber-preprocessor/steps";
require('@cypress/xpath');

Then('user is on repository browser page', () => {
    cy.get('eui-card-header-title').should('be.visible');
    cy.wait(3000);
})

When('click on create proposal button', () => {
    cy.get('eui-card-header-title').first().click();
    // cy.xpath("//*[text()=' Create Proposal ']").click();
    cy.wait(3000);
})

