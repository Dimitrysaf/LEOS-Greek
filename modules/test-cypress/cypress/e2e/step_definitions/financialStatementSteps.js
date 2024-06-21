import { When, Then } from "cypress-cucumber-preprocessor/steps";
import financialStatementPage from "../pages/financialStatementPage";

Then('user is on financial statement page', () => {
    financialStatementPage.getCurrentPageName().should("have.text", "Financial Statement");
    cy.wait(2000);
});

When('click on close button on financial statement page', () => {
    financialStatementPage.clickCloseBtn();
});

Then('doctype is {string}', (doctype) => {
    financialStatementPage.elements.doctype().should('have.text', doctype);
});

When('mouseover and click on level {int} in financial statement page', (levelNumber) => {
    financialStatementPage.mouseHoverAndClickOnLevel(levelNumber);
});

Then('content of level {int} contains {string} in financial statement page', (levelNumber, content) => {
    financialStatementPage.getContentOfLevel(levelNumber).should('include.text', content);
});

Then('content of subparagraph {int} of level {int} contains {string} in financial statement page', (subparagraphNumber, levelNumber, content) => {
    financialStatementPage.getContentOfSubparagraphOfLevel(subparagraphNumber, levelNumber).should('include.text', content);
});

When('click on edit icon of level {int} in financial statement page', function (levelNumber) {
    financialStatementPage.clickEditIconOfLevel(levelNumber);
});