import { Before, Given, When, And, Then } from "cypress-cucumber-preprocessor/steps";
require('@cypress/xpath');
import legalActPage from "../pages/legalActPage";

Then('user is on legal act page', () => {
    legalActPage.getCurrentPageName().should("have.text", "Legal Act");
    cy.wait(2000);
})

When('mousehover article {int}', articleNumber => {
    legalActPage.mouseHoverOnArticle(articleNumber);
})

When('mousehover and click on citation {int}', citationNumber => {
    legalActPage.mouseHoverAndClickOnCitation(citationNumber);
})

When('mousehover and click on recital {int}', recitalNumber => {
    legalActPage.mouseHoverAndClickOnRecital(recitalNumber);
})

When('open ck editor for article {int}', (articleNumber) => {
    legalActPage.openCkEditorForArticle(articleNumber);
    cy.wait(2000);
})

When('click on close button present in legal act page', () => {
    legalActPage.elements.closeBtn().click();
    cy.wait(1000);
})
 
When('{int} paragraphs are present in article {int}', (paragraphNumber, articleNumber) => {
    legalActPage.getParagraphFromArticle(articleNumber).should('have.length', paragraphNumber);
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
    cy.wait(10000);
})

// And('{string} is present in content of paragraph {int} of article {int}', (text, paragraphNumber, articleNumber) => {
//     cy.xpath("//article[" + articleNumber + "]//paragraph[" + paragraphNumber + "]//content//aknp").should('have.text', text);
// })

// When('click on article {int}', articleNumber => {
//     // cy.get("#_art_" + articleNumber).trigger('mouseover').trigger("click");
//     cy.get("#_art_" + articleNumber).trigger('mouseover');
//     cy.wait(10000);
// })

// When('click on {string} present in enacting terms', (enactingTerm) => {
//     cy.xpath("//mat-nested-tree-node//*[text()='" + enactingTerm + "']").click();
// })

// When('click enter at offset 8 in paragraph 1 of article 1 when ck editor is open', (offset, paragraphNumber, articleNumber) => {
//     cy.window().then((w) => {
//         w.EditorConnector.handleEdit({
//             "action": "edit",
//             "elementId": "_art_" + articleNumber + "",
//             "elementType": "article",
//             "elementCursorId": "_art_" + articleNumber + "",
//             "elementCursorChildPos": 0,
//             "elementCursorPos": 0
//         })

//         cy.wait(1000).then(() => {
//             let editor = w.CKEDITOR.instances.editor1;
//             editor.execCommand('enter');
//         })

//     })
// })