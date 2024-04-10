import { Before, Given, When, And, Then } from "cypress-cucumber-preprocessor/steps";
require('@cypress/xpath');

When('open ck editor for article {int}', (articleNumber) => {
    cy.window().then((w) => {
        w.EditorConnector.handleEdit({
            "action": "edit",
            "elementId": "_art_" + articleNumber,
            "elementType": "article",
            "elementCursorId": "_art_" + articleNumber,
            "elementCursorChildPos": 0,
            "elementCursorPos": 0
        })
    });
    cy.wait(2000);
})