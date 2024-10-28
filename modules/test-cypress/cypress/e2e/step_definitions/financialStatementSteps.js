import { When, Then } from "cypress-cucumber-preprocessor/steps";
import financialStatementPage from "../pages/financialStatementPage";
import headerPage from "../pages/headerPage";

Then('user is on financial statement page', () => {
    headerPage.getCurrentPageName().should("have.text", "Financial Statement");
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

Then('content of level {int} has below content', (levelNumber, datatable) => {
    financialStatementPage.getContentOfLevel(levelNumber).then((element) => {
        checkContentResult(element, datatable);
    });
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

function checkContentResult(element, datatable) {
    element[0].childNodes.forEach((element, index) => {
        if (element.nodeType === 1 && (datatable.raw().at(index).at(0).includes(",") || datatable.raw().at(index).at(0) !== "html")) {
            const elementsArray = datatable.raw().at(index).at(0).split(",");
            for (let elementIndex = 0; elementIndex < elementsArray.length; elementIndex++) {
                expect(element.localName).equal(elementsArray[elementIndex]);
                element = element.childNodes[0];
            }
            expect(element.textContent + "\"").equal(datatable.raw().at(index).at(1).substring(1));
        }
        if (element.nodeType === 1 && datatable.raw().at(index).at(0) === "html") {
            const re = new RegExp(datatable.raw().at(index).at(1));
            expect(true).equal(re.test(element.outerHTML));
        }
    })
}
