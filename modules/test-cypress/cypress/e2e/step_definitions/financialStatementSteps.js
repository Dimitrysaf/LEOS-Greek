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
