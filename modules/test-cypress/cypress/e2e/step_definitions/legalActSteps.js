import { Before, Given, When, And, Then } from "cypress-cucumber-preprocessor/steps";
require('@cypress/xpath');
import legalActPage from "../pages/legalActPage";

Then('user is on legal act page', () => {
    legalActPage.getCurrentPageName().should("have.text", "Legal Act");
    cy.wait(10000);
})

Then('document has {int} trackchange {string} tags with {string} content', (count, type, content) => {
    legalActPage.getCurrentPageName().get(type).should("have.length", count);
    legalActPage.getCurrentPageName().get(type).should("have.text", content);
})

Then('document has {int} trackchange {string} tags with below content', (count, type, datatable) => {
    legalActPage.getCurrentPageName().get(type).should("have.length", count);
    legalActPage.getCurrentPageName().get(type).each((element, index) => {
        expect(element[0].textContent).equal(datatable.raw().at(index).toString());
    });
})

Then('paragraph {int} of article {int} has below content', (paragraph, article, datatable) => {
    legalActPage.getParagraphContentFromArticle(paragraph, article).then((element) => {
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
    });
})

Then('num of point {int} of paragraph {int} of article {int} has below content', (point, paragraph, article, datatable) => {
    legalActPage.getNumContentFromPointFromParagraphFromArticle(point, paragraph, article).then((element) => {
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
    });
})

When('mousehover and click on citation {int}', citationNumber => {
    legalActPage.mouseHoverAndClickOnCitation(citationNumber);
})

When('mousehover and click on recital {int}', recitalNumber => {
    legalActPage.mouseHoverAndClickOnRecital(recitalNumber);
})

When('mousehover and click on article {int}', articleNumber => {
    legalActPage.mouseHoverAndClickOnArticle(articleNumber);
})

When('click on close button present in legal act page', () => {
    legalActPage.clickCloseBtn();
})
 
When('{int} paragraphs are present in article {int}', (paragraphNumber, articleNumber) => {
    legalActPage.getAllParagraphFromArticle(articleNumber).should('have.length', paragraphNumber);
})

And('ribbon toolbar is displayed', () => {
    legalActPage.elements.ribbonToolBar().should('be.visible');
})
  
And('citation {int} contains {string}', (citationNumber,text) => {
    legalActPage.getCitation(citationNumber).contains(text);
})

And('citation {int} doesnot contain {string}', (citationNumber,text) => {
    legalActPage.getCitation(citationNumber).should('not.include.text', text)
})

And('recital {int} contains {string}', (recitalNumber,text) => {
    legalActPage.getRecital(recitalNumber).contains(text);
})

And('recital {int} doesnot contain {string}', (recitalNumber,text) => {
    legalActPage.getRecital(recitalNumber).should('not.include.text', text)
})

When('mousehover on citation {int} and click on edit button from action menu', (citationNumber) => {
    legalActPage.mouseHoverOnCitation(citationNumber);
    legalActPage.mouseHoverOnThreeDots();
    legalActPage.elements.editIconActionMenu().click();
})

Then(`paragraph {int} of article {int} contains {string}`, (paragraphNumber, articleNumber, text) => {
    legalActPage.getParagraphFromArticle(paragraphNumber,articleNumber).should('include.text', text);
});

Then(`paragraph {int} of article {int} doesnot contain {string}`, (paragraphNumber, articleNumber, text) => {
    legalActPage.getParagraphFromArticle(paragraphNumber,articleNumber).should('not.include.text', text);
});

When('enable track changes', () => {
    legalActPage.clickEnableTrackchangesToggleBtn();
})
