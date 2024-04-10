import { Before, Given, When, And, Then } from "cypress-cucumber-preprocessor/steps";
require('@cypress/xpath');

Then('user is on legal act page', () => {
    cy.get('eui-breadcrumb eui-breadcrumb-item:last-child .eui-label').should('be.visible').should("have.text", "Legal Act");
    cy.wait(2000);
})

When('click on {string} present in enacting terms', (enactingTerm) => {
    cy.xpath("//mat-nested-tree-node//*[text()='" + enactingTerm + "']").click();
})

When('mousehover article {int}', articleNumber => {
    cy.get("#_art_" + articleNumber).trigger('mouseover');
})

When('{int} paragraphs are present in article {int}', (paragraphNumber, articleNumber) => {
    cy.xpath("//article[" + articleNumber + "]//paragraph").should('have.length', paragraphNumber);
})

And('{string} is present in content of paragraph {int} of article {int}', (text, paragraphNumber, articleNumber) => {
    cy.xpath("//article[" + articleNumber + "]//paragraph[" + paragraphNumber + "]//content//aknp").should('have.text', text);
})

When('click on article {int}', articleNumber => {
    // cy.get("#_art_" + articleNumber).trigger('mouseover').trigger("click");
    cy.get("#_art_" + articleNumber).trigger('mouseover');
    cy.wait(10000);
})

Then('ck editor window is displayed', () => {
    cy.get('.cke_editable.cke_editable_inline').should('be.visible');
})

When('append {string} at offset {int} in paragraph {int} of article {int} when ck editor is open', function (newContent, offset, paragraphNumber, articleNumber) {
    cy.window().then((w) => {
        cy.wait(2000).then(() => {
            let editor = w.CKEDITOR.instances.editor1;
            let elementToPutCursorParent = editor.element.findOne("#_art_"+articleNumber+"__para_"+paragraphNumber);
            let elementToPutCursor = elementToPutCursorParent.getChild(0);
            let range = editor.createRange();
            range.moveToPosition(elementToPutCursor, w.CKEDITOR.POSITION_AFTER_START);
            range.setStart(elementToPutCursor, 3);
            range.setEnd(elementToPutCursor, 3);
            range.collapse(true);
            range.select();
            range.startContainer.$.appendData(' adding new data ');
            range.setStart(elementToPutCursor, 10);
            range.setEnd(elementToPutCursor, 10);
            range.collapse(true);
            range.select();
        })

        cy.wait(1000).then(() => {
            let editor = w.CKEDITOR.instances.editor1;
            editor.execCommand('enter');
        })
    });

});

When('click enter at offset 8 in paragraph 1 of article 1 when ck editor is open', (offset, paragraphNumber, articleNumber) => {
    cy.window().then((w) => {
        w.EditorConnector.handleEdit({
            "action": "edit",
            "elementId": "_art_" + articleNumber + "",
            "elementType": "article",
            "elementCursorId": "_art_" + articleNumber + "",
            "elementCursorChildPos": 0,
            "elementCursorPos": 0
        })

        cy.wait(1000).then(() => {
            let editor = w.CKEDITOR.instances.editor1;
            editor.execCommand('enter');
        })

    })
})

When('click save and close button of ck editor', () => {
    cy.get('.cke_button__leosinlinesaveclose').click();
    cy.wait(2000);
})

Then('ck editor window is not displayed', () => {
    cy.get('.cke_editable.cke_editable_inline').should('not.exist');
})