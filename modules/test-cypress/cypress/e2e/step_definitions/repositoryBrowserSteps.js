import { Before, Given, When, And, Then } from "cypress-cucumber-preprocessor/steps";
require('@cypress/xpath');

Then('user is on repository browser page', () => {
    cy.get('eui-card-header-title').should('be.visible');
})

When('click on create proposal button', () => {
    cy.xpath("//*[text()=' Create Proposal ']").click();
})

When('click proposal {int} in repository browser page', (proposalRank) => {
    cy.get('eui-card-header-title').eq(proposalRank-1).click();
    cy.wait(2000);
})

When('click on workspace button from breadcrumb item', () => {
    cy.get('eui-breadcrumb eui-breadcrumb-item:nth-child(2) button').click();
    cy.wait(1000);
})

