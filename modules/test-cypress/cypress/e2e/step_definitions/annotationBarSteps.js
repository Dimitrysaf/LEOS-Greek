import { Before, Given, When, And, Then } from "cypress-cucumber-preprocessor/steps";
require('@cypress/xpath');

And('annotation side bar is present', () => {
    cy.get('eui-page-column.annotations-pane').should('be.visible');
})

And('annotation side bar is minimized', () => {
    
})

