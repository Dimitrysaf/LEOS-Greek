import { When, Then } from "cypress-cucumber-preprocessor/steps";
import financialStatementPage from "../pages/financialStatementPage";
import headerPage from "../pages/headerPage";
import {checkContentResult} from "../util/expectDataTable";

Then('user is on financial statement page', () => {
    headerPage.getCurrentPageName().should("have.text", "Digital Financial Statement");
    cy.wait(5000);
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

When('click on edit icon of subparagraph {int} of landscape level {int} in financial statement page', function (subparagraphNumber, levelNumber) {
    financialStatementPage.clickEditIconOfSubparagraphOfLandscapeLevel(subparagraphNumber, levelNumber);
});

Then('content of level {int} has below content', (levelNumber, datatable) => {
    financialStatementPage.getContentOfLevel(levelNumber).then((element) => {
        checkContentResult(element, datatable);
    });
});

Then('{string} is added as internal reference {int} of content of level {int}', (text, mReferenceNumber, levelNumber) => {
    financialStatementPage.getMRefTextFromContentOfLevel(mReferenceNumber, levelNumber).should('have.text', text);
});

When('click on insert after icon of repeatable subparagraph', () => {
    financialStatementPage.duplicateRepeatableSubparagraph();
});

Then('repeated subparagraph should exist', () => {
    financialStatementPage.elements.repeatedSubparagraph().first().should('exist');
});

When('click on delete icon of repeated subparagraph', () => {
    financialStatementPage.deleteRepeatedSubparagraph();
});

Then('repeated subparagraph should not exist', () => {
    financialStatementPage.elements.repeatedSubparagraph().should('not.exist');
});

Then('repeated subparagraph should have track changes action delete', () => {
    financialStatementPage.elements.repeatedSubparagraph().should('have.attr', 'leos:action').and('equal', 'delete');
});

When('click on insert group after icon of repeatable subparagraph', () => {
    financialStatementPage.duplicateRepeatableSubparagraphGroupAfter();
});

Then('repeated subparagraph group after should exist', () => {
    financialStatementPage.elements.repeatedSubparagraphGroupAfter().first().should('exist');
});

When('click on insert group before icon of repeatable subparagraph', () => {
    financialStatementPage.duplicateRepeatableSubparagraphGroupBefore();
});

Then('repeated subparagraph group before should exist', () => {
    financialStatementPage.elements.repeatedSubparagraphGroupBefore().first().should('exist');
});

Then('content of subparagraph {int} of level {int} contains a table with {int} row and {int} column in financial statement document', function (subparagraphNumber, levelNumber, rowNumber, columnNumber) {
    financialStatementPage.getRowFromTableOfSubparagraphFromLevel(subparagraphNumber, levelNumber).should('have.length', rowNumber);
    financialStatementPage.getColumnFromTableOfSubparagraphFromLevel(subparagraphNumber, levelNumber).should('have.length', columnNumber);
});

When(/^user selects checkbox (\d+) of level "([^"]*)"$/, function (checkboxIndex, levelName) {
    financialStatementPage.selectCheckboxInLevel(checkboxIndex, levelName);
});

Then(/^checkbox (\d+) of level "([^"]*)" is selected$/, function (checkboxIndex, levelName) {
    financialStatementPage.getCheckBoxInLevel(checkboxIndex, levelName).should('have.attr', 'name', 'checked');
});

When('user deselects checkbox {int} of level {string}', (checkboxIndex, levelNum) => {
    financialStatementPage.unSelectCheckboxInLevel(checkboxIndex, levelNum);
});

Then(/^checkbox (\d+) of level "([^"]*)" is deselected$/, function (checkboxIndex, levelName) {
    financialStatementPage.getCheckBoxInLevel(checkboxIndex, levelName).should('have.attr', 'name', 'unchecked');
});

And('total number of selected checkbox inside level {string} is {int}', (levelName, totalNumberOfChkBoxes) => {
    financialStatementPage.getSelectedCheckBoxInLevel(levelName).should('have.length', totalNumberOfChkBoxes);
});

When('user selects all the checkboxes of level {string}',(levelName) => {
    financialStatementPage.selectAllCheckboxesInLevel(levelName)
});

And(/^click on delete icon of repeatable subparagraph (\d+) of level "([^"]*)"$/, function (repeatableSubparagraphNumber, levelName) {
    financialStatementPage.deleteRepeatableSubparagraph(repeatableSubparagraphNumber,levelName);
});

Then ('repeatable subparagraph {int} of level {string} contains attribute name {string} with value {string}',(repeatableSubparagraphNumber, levelName, attributeName, attributeValue)=>{
    financialStatementPage.getRepeatedSubparagraphOfLevel(repeatableSubparagraphNumber, levelName).should('have.attr', attributeName, attributeValue);
})

When(/^right click on repeatable subparagraph (\d+) of level "([^"]*)"$/, function (repeatableSubparagraphNumber, levelName) {
    financialStatementPage.getRepeatedSubparagraphOfLevel(repeatableSubparagraphNumber, levelName).rightclick();
});

Then ('repeatable subparagraph {int} of level {string} does not contain attribute name {string} with value {string}',(repeatableSubparagraphNumber, levelName, attributeName, attributeValue)=>{
    financialStatementPage.getRepeatedSubparagraphOfLevel(repeatableSubparagraphNumber, levelName).should('not.have.attr', attributeName, attributeValue);
})

/*When(/^scroll the view into level "([^"]*)"$/, function (levelName) {
    financialStatementPage.getLevelByNum(levelName).scrollIntoView();
});*/
