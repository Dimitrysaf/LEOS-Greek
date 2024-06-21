import { When, And, Then } from "cypress-cucumber-preprocessor/steps";
require('@cypress/xpath');
import legalActPage from "../pages/legalActPage";

Then('user is on legal act page', () => {
    legalActPage.getCurrentPageName().should("have.text", "Legal Act");
    cy.wait(7000);
})

Then('document has {int} trackChange {string} tags with {string} content', (count, type, content) => {
    legalActPage.getCurrentPageName().get(type).should("have.length", count);
    legalActPage.getCurrentPageName().get(type).should("have.text", content);
})

Then('document has {int} trackChange {string} tags with below content', (count, type, datatable) => {
    legalActPage.getCurrentPageName().get(type).should("have.length", count);
    legalActPage.getCurrentPageName().get(type).each((element, index) => {
        expect(element[0].textContent).equal(datatable.raw().at(index).toString());
    });
})

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

Then('paragraph {int} of article {int} has below content', (paragraph, article, datatable) => {
    legalActPage.getContentOfParagraphFromArticle(paragraph, article).then((element) => {
        checkContentResult(element, datatable);
    });
})

Then('num of point {int} of list {int} of paragraph {int} of article {int} has below content', (point, list, paragraph, article, datatable) => {
    legalActPage.getNumTagOfPointOfParagraphFromArticle(point, list, paragraph, article).then((element) => {
        checkContentResult(element, datatable);
    });
})

Then('point {int} of list {int} of paragraph {int} of article {int} has below content', (point, list, paragraph, article, datatable) => {
    legalActPage.getContentOfPointOfParagraphFromArticle(point, list, paragraph, article).then((element) => {
        checkContentResult(element, datatable);
    });
})

When('mouseover and click on citation {int}', citationNumber => {
    legalActPage.mouseHoverAndClickOnCitation(citationNumber);
})

When('mouseover and click on recital {int}', recitalNumber => {
    legalActPage.mouseHoverAndClickOnRecital(recitalNumber);
})

When('mouseover and click on article {int}', articleNumber => {
    legalActPage.mouseHoverAndClickOnArticle(articleNumber);
})

When('click on edit icon of article {int}', articleNumber => {
    legalActPage.clickEditIconOfArticle(articleNumber);
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

And("citation {int} doesn't contain {string}", (citationNumber,text) => {
    legalActPage.getCitation(citationNumber).should('not.include.text', text)
})

And('recital {int} contains {string}', (recitalNumber,text) => {
    legalActPage.getRecital(recitalNumber).contains(text);
})

And("recital {int} doesn't contain {string}", (recitalNumber,text) => {
    legalActPage.getRecital(recitalNumber).should('not.include.text', text)
})

Then(`content of paragraph {int} of article {int} contains {string}`, (paragraphNumber, articleNumber, text) => {
    legalActPage.getContentOfParagraphFromArticle(paragraphNumber,articleNumber).should('include.text', text);
});

Then(`paragraph {int} of article {int} doesn't contain {string}`, (paragraphNumber, articleNumber, text) => {
    legalActPage.getParagraphFromArticle(paragraphNumber,articleNumber).should('not.include.text', text);
});

Then(`preface long title docPurpose contains {string}`, (title) => {
    legalActPage.elements.docPurpose().should('include.text',title);
});

When(`click on insert after icon of article {int}`, (articleNumber) => {
    legalActPage.clickInsertAfterIconOfArticle(articleNumber);
});

Then(`heading of article {int} contains {string}`, (articleNumber, heading) => {
    legalActPage.getHeadingFromArticle(articleNumber).should('have.text',heading);
});

Then(`paragraph {int} of article {int} doesn't contain num tag`, (paragraphNumber, articleNumber) => {
    legalActPage.getNumTagOfParagraphFromArticle(paragraphNumber, articleNumber).should('not.exist');
});

Then(`article {int} doesn't contain indent tag`, (articleNumber) => {
    legalActPage.getIndentTagFromArticle(articleNumber).should('not.exist');
});

And(`num tag of point {int} of list {int} of paragraph {int} of article {int} contains {string}`, (pointNumber, listNumber, paragraphNumber, articleNumber, content) => {
    legalActPage.getNumTagOfPointOfParagraphFromArticle(pointNumber, listNumber, paragraphNumber, articleNumber).should('have.text', content);
});

And(`num tag of point {int} of list {int} of point {int} of list {int} of paragraph {int} of article {int} contains {string}`, (pointNumber2, listNumber2, pointNumber1, listNumber1, paragraphNumber, articleNumber, content) => {
    legalActPage.getNumTagOfPointOfPointOfParagraphFromArticle(pointNumber2, listNumber2, pointNumber1, listNumber1, paragraphNumber, articleNumber).should('have.text', content);
});

And(`num tag of point {int} of list {int} of point {int} of list {int} of point {int} of list {int} of paragraph {int} of article {int} contains {string}`, (pointNumber3, listNumber3, pointNumber2, listNumber2, pointNumber1, listNumber1, paragraphNumber, articleNumber, content) => {
    legalActPage.getNumTagOfPointOfPointOfPointOfParagraphFromArticle(pointNumber3, listNumber3, pointNumber2, listNumber2, pointNumber1, listNumber1, paragraphNumber, articleNumber).should('have.text', content);
});

And(`num tag of indent {int} of list {int} of point {int} of list {int} of point {int} of list {int} of point {int} of list {int} of paragraph {int} of article {int} contains {string}`, (indentNumber, listNumber4, pointNumber3, listNumber3, pointNumber2, listNumber2, pointNumber1, listNumber1, paragraphNumber, articleNumber, content) => {
    legalActPage.getNumTagOfIndentOfPointOfPointOfPointOfParagraphFromArticle(indentNumber, listNumber4, pointNumber3, listNumber3, pointNumber2, listNumber2, pointNumber1, listNumber1, paragraphNumber, articleNumber).should('have.text', content);
});
  
Then(`content of point {int} of list {int} of paragraph {int} of article {int} contains {string}`, (pointNumber, listNumber, paragraphNumber, articleNumber, content) => {
    legalActPage.getContentOfPointOfParagraphFromArticle(pointNumber, listNumber, paragraphNumber, articleNumber).should('include.text', content);
});

And(`content of point {int} of list {int} of point {int} of list {int} of paragraph {int} of article {int} contains {string}`, (pointNumber2, listNumber2, pointNumber1, listNumber1, paragraphNumber, articleNumber, content) => {
    legalActPage.getContentOfPointOfPointOfParagraphFromArticle(pointNumber2, listNumber2, pointNumber1, listNumber1, paragraphNumber, articleNumber).should('include.text', content);
});

And(`content of point {int} of list {int} of point {int} of list {int} of point {int} of list {int} of paragraph {int} of article {int} contains {string}`, (pointNumber3, listNumber3, pointNumber2, listNumber2, pointNumber1, listNumber1, paragraphNumber, articleNumber, content) => {
    legalActPage.getContentOfPointOfPointOfPointOfParagraphFromArticle(pointNumber3, listNumber3, pointNumber2, listNumber2, pointNumber1, listNumber1, paragraphNumber, articleNumber).should('include.text', content);
});

And(`content of indent {int} of list {int} of point {int} of list {int} of point {int} of list {int} of point {int} of list {int} of paragraph {int} of article {int} contains {string}`, (indentNumber, listNumber4, pointNumber3, listNumber3, pointNumber2, listNumber2, pointNumber1, listNumber1, paragraphNumber, articleNumber, content) => {
    legalActPage.getContentOfIndentOfPointOfPointOfPointOfParagraphFromArticle(indentNumber, listNumber4, pointNumber3, listNumber3, pointNumber2, listNumber2, pointNumber1, listNumber1, paragraphNumber, articleNumber).should('have.text', content);
});

Then(`content of subparagraph {int} of list {int} of paragraph {int} of article {int} contains {string}`, (subparagraphNumber, listNumber, paragraphNumber, articleNumber, content) => {
    legalActPage.getContentOfSubparagraphOfListOfParagraphFromArticle(subparagraphNumber, listNumber, paragraphNumber, articleNumber).should('include.text', content);
});

And(`content of subparagraph {int} of list {int} of point {int} of list {int} of paragraph {int} of article {int} contains {string}`, (subparagraphNumber, subParagraphListNumber, pointNumber, poinListNumber, paragraphNumber, articleNumber, content) => {
    legalActPage.getContentOfSubParagraphOfPointOfParagraphOfArticle(subparagraphNumber, subParagraphListNumber, pointNumber, poinListNumber, paragraphNumber, articleNumber).should('include.text', content);
});

And(`content of subparagraph {int} of list {int} of point {int} of list {int} of point {int} of list {int} of paragraph {int} of article {int} contains {string}`, (subparagraphNumber, subParagraphListNumber, pointNumber2, poinListNumber2, pointNumber1, poinListNumber1, paragraphNumber, articleNumber, content) => {
    legalActPage.getContentOfSubParagraphOfPointOfPointOfParagraphOfArticle(subparagraphNumber, subParagraphListNumber, pointNumber2, poinListNumber2, pointNumber1, poinListNumber1, paragraphNumber, articleNumber).should('include.text', content);
});

And(`content of subparagraph {int} of list {int} of point {int} of list {int} of point {int} of list {int} of point {int} of list {int} of paragraph {int} of article {int} contains {string}`, (subparagraphNumber, subParagraphListNumber, pointNumber3, poinListNumber3, pointNumber2, poinListNumber2, pointNumber1, poinListNumber1, paragraphNumber, articleNumber, content) => {
    legalActPage.getContentOfSubParagraphOfPointOfPointOfPointOfParagraphOfArticle(subparagraphNumber, subParagraphListNumber, pointNumber3, poinListNumber3, pointNumber2, poinListNumber2, pointNumber1, poinListNumber1, paragraphNumber, articleNumber).should('include.text', content);
});

And(`content of subparagraph {int} of paragraph {int} of article {int} contains {string}`, (subparagraphNumber, paragraphNumber, articleNumber, content) => {
    legalActPage.getContentOfSubparagraphOfParagraphFromArticle(subparagraphNumber, paragraphNumber, articleNumber).should('include.text', content);
});

And(`num tag of paragraph {int} of article {int} contains {string}`, (paragraphNumber, articleNumber, content) => {
    legalActPage.getNumTagOfParagraphFromArticle(paragraphNumber, articleNumber).should('include.text', content);
});

Then(`content of subparagraph refersTo {string} of list {int} of paragraph {int} of article {int} contains {string}`, (subparagraphRefersTo, listNumber, paragraphNumber, articleNumber, content) => {
    legalActPage.getContentOfSubParagraphRefersToListOfParagraphOfArticle(subparagraphRefersTo, listNumber, paragraphNumber, articleNumber, content).should('have.text', content);
});

Then(`{int} recitals are added in legal act by import oj`, (recitalNumber) => {
    legalActPage.elements.recitalFromImportOj().should('have.length', recitalNumber);
});

Then(`{int} articles are added in legal act by import oj`, (articleNumber) => {
    legalActPage.elements.articleFromImportOj().should('have.length', articleNumber);
});

When(`click on edit icon of citation {int}`, (citationNumber) => {
    legalActPage.clickEditIconOfCitation(citationNumber);
});

Then(`{string} is added as internal reference {int} of citation {int}`, (text, mReferenceNumber, citationNumber) => {
    legalActPage.getMRefTextFromCitation(mReferenceNumber,citationNumber).should('have.text', text);
});

Then(`{string} is added as internal reference {int} of recital {int}`, (text, mReferenceNumber, recitalNumber) => {
    legalActPage.getMRefTextFromRecital(mReferenceNumber,recitalNumber).should('have.text', text);
});

Then(`{string} is added as internal reference {int} of point {int} of list {int} of paragraph {int} of article {int}`, (text, mReferenceNumber, pointNumber, listNumber, paragraphNumber, articleNumber) => {
    legalActPage.getMRefTextFromPointOfParagraphOfArticle(mReferenceNumber, pointNumber, listNumber, paragraphNumber, articleNumber).should('have.text', text);
});

Then(`{string} is added as internal reference {int} of paragraph {int} of article {int}`, (text, mReferenceNumber, paragraphNumber, articleNumber) => {
    legalActPage.getMRefTextFromParagraphOfArticle(mReferenceNumber, paragraphNumber, articleNumber).should('have.text', text);
});

Then(`citation {int} is displayed`, (citationNumber) => {
    legalActPage.getCitation(citationNumber).should('be.visible')
});

Then(`recital {int} is displayed`, (recitalNumber) => {
    legalActPage.getRecital(recitalNumber).should('be.visible');
});

Then(`article {int} is displayed`, (articleNumber) => {
    legalActPage.getArticle(articleNumber).should('be.visible');
});

Then(`paragraph {int} of article {int} is displayed`, (paragraphNumber, articleNumber) => {
    legalActPage.getParagraphFromArticle(paragraphNumber, articleNumber).should('be.visible');
});

Then(`point {int} of list {int} of paragraph {int} of article {int} is displayed`, (pointNumber, listNumber, paragraphNumber, articleNumber) => {
    legalActPage.getPointOfParagraphFromArticle(pointNumber, listNumber, paragraphNumber, articleNumber).should('be.visible');
});

When(`click on internal reference link {int} of citation {int}`, (mReferenceNumber, citationNumber) => {
    legalActPage.clickRefOfMRefOfCitation(mReferenceNumber, citationNumber);
});

When(`click on internal reference link {int} of recital {int}`, (mReferenceNumber, recitalNumber) => {
    legalActPage.clickRefOfMRefOfRecital(mReferenceNumber, recitalNumber);
});

When(`click on internal reference link {int} of paragraph {int} of article {int}`, (mReferenceNumber, paragraphNumber, articleNumber) => {
    legalActPage.clickRefOfMRefOfParagraphOfArticle(mReferenceNumber, paragraphNumber, articleNumber);
});

When(`click on internal reference link {int} of point {int} of list {int} of paragraph {int} of article {int}`, (mReferenceNumber, pointNumber, listNumber, paragraphNumber, articleNumber) => {
    legalActPage.clickRefOfMRefOfPointOfParagraphOfArticle(mReferenceNumber, pointNumber, listNumber, paragraphNumber, articleNumber);
});