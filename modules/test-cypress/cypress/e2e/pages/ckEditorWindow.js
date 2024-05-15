class ckEditorWindow {
    elements = {
        ckEditableInline: () => cy.get('.cke_editable.cke_editable_inline'),
        saveAndCloseBtn: () => cy.get('.cke_button__leosinlinesaveclose'),
        closeBtn: () => cy.get('.cke_button__leosinlinecancel'),
        saveBtn: () => cy.get('.cke_button__leosinlinesave'),
        undoBtn: () => cy.get('.cke_button__undo'),
        footNoteBtn: () => cy.get('.cke_button__authorialnotewidget'),
        internalReferenceBtn: () => cy.get('.cke_button__leoscrossreference')
    }

    addTextAtCurrentCursorPositionWhenCKEditorOpen(newContent) {
        cy.get('.cke_editable.cke_editable_inline').type('{insert}' + newContent);
    }

    clickDeleteFromKeyboardWhenCKEditorOpen() {
        cy.get('.cke_editable.cke_editable_inline').type('{del}');
    }

    clickEnterFromKeyboardWhenCKEditorOpen() {
        cy.get('.cke_editable.cke_editable_inline').type('{enter}');
    }

    getCkEditableInlineElement() {
        return this.elements.ckEditableInline();
    }

    clickSaveAndCloseBtn() {
        this.elements.saveAndCloseBtn().click();
        cy.wait(2000);
    }

    clickCloseBtn() {
        this.elements.closeBtn().click();
    }

    clickSaveBtn() {
        this.elements.saveBtn().click();
    }

    getNumberedParagraphElementOfArticle(paragraphNumber) {
        return this.elements.ckEditableInline().find("article li[data-akn-element='paragraph'][data-akn-num='" + paragraphNumber + ".']");
    }

    moveCursorToSpecificOffsetInParagraphOfArticle(offset, paragraphNumber, articleNumber) {
        this.moveCursor(offset, "#_art_" + articleNumber + "__para_" + paragraphNumber);
    }

    appendContentInNumberedParagraphOfArticle(newContent, offset, paragraphNumber, child) {
        this.elements.ckEditableInline().find("article ol li[data-akn-name='aknNumberedParagraph'][data-akn-num='" + paragraphNumber + ".']").invoke('attr', 'id').then(id => this.addContent(newContent, offset, "#"+id, child));
    }

    deleteContentInNumberedParagraphOfArticle(key, offset, paragraphNumber, child, times) {
        this.elements.ckEditableInline().find("article ol li[data-akn-name='aknNumberedParagraph'][data-akn-num='" + paragraphNumber + ".']").invoke('attr', 'id').then(id => this.pressSpecialKey(key, offset, "#"+id, child, times));
    }

    addContentInCitation(newContent, offset, citationNumber) {
        this.addContent(newContent, offset, "#_cit_" + citationNumber);
    }

    addContentInRecital(newContent, offset, recitalNumber) {
        this.addContent(newContent, offset, "#_rec_" + recitalNumber);
    }

    selectContentInCitation(offsetStart, offsetEnd, citationNumber) {
        this.selectContent(offsetStart, offsetEnd, "#_cit_" + citationNumber);
    }

    selectContentInRecital(offsetStart, offsetEnd, recitalNumber) {
        this.selectContent(offsetStart, offsetEnd, "#_rec_" + recitalNumber);
    }

    selectContentInNumberedParagraphOfArticle(offsetStart, offsetEnd, paragraphNumber) {
        this.elements.ckEditableInline().find("article ol li[data-akn-name='aknNumberedParagraph'][data-akn-num='" + paragraphNumber + ".']").invoke('attr', 'id').then(id => this.selectContent(offsetStart, offsetEnd, "#"+id));
    }

    selectContent(offsetStart, offsetEnd, element) {
        cy.window().then((w) => {
            cy.then(() => {
                let editor = w.CKEDITOR.instances[Object.keys(w.CKEDITOR.instances)[0]];
                let elementToPutCursorParent = editor.element.findOne(element);
                let elementToPutCursor = elementToPutCursorParent.getChild(0);
                let range = editor.createRange();
                range.moveToPosition(elementToPutCursor, w.CKEDITOR.POSITION_AFTER_START);
                range.setStart(elementToPutCursor, offsetStart);
                range.setEnd(elementToPutCursor, offsetEnd);
                range.select();
            })
        });
    }

    addContent(newContent, offset, element, child) {
        if (!child) {
            child = 0;
        }
        cy.window().then((w) => {
            cy.then(() => {
                let editor = w.CKEDITOR.instances[Object.keys(w.CKEDITOR.instances)[0]];
                let elementToPutCursorParent = editor.element.findOne(element);
                let elementToPutCursor = elementToPutCursorParent.getChild(child);
                let range = editor.createRange();
                range.moveToPosition(elementToPutCursor, w.CKEDITOR.POSITION_AFTER_START);
                range.setStart(elementToPutCursor, offset);
                range.setEnd(elementToPutCursor, offset);
                range.collapse(true);
                range.select();
                cy.get('.cke_editable.cke_editable_inline').type('{insert}' + newContent, {delay:0});
                editor.fire("change");
            })
        });
    }

    pressSpecialKey(key, offset, element, child, times) {
        if (!child) {
            child = 0;
        }
        if (!times) {
            times = 1;
        }
        cy.window().then((w) => {
            cy.then(() => {
                let editor = w.CKEDITOR.instances[Object.keys(w.CKEDITOR.instances)[0]];
                let elementToPutCursorParent = editor.element.findOne(element);
                let elementToPutCursor = elementToPutCursorParent.getChild(child);
                if (child !== 0 && elementToPutCursor.type !== 3) {
                    elementToPutCursor = elementToPutCursor.getChild(0);
                }
                let range = editor.createRange();
                range.moveToPosition(elementToPutCursor, w.CKEDITOR.POSITION_AFTER_START);
                range.setStart(elementToPutCursor, offset);
                range.setEnd(elementToPutCursor, offset);
                range.collapse(true);
                range.select();
                for (var count = 1; count <= times; count++) {
                    cy.get('.cke_editable.cke_editable_inline').type('{' + key + '}', {delay:0});
                }
                editor.fire("change");
            })
        });
    }

    moveCursor(offset, element) {
        cy.window().then((w) => {
            cy.then(() => {
                let editor = w.CKEDITOR.instances[Object.keys(w.CKEDITOR.instances)[0]];
                let elementToPutCursorParent = editor.element.findOne(element);
                let elementToPutCursor = elementToPutCursorParent.getChild(0);
                let range = editor.createRange();
                range.moveToPosition(elementToPutCursor, w.CKEDITOR.POSITION_AFTER_START);
                range.setStart(elementToPutCursor, offset);
                range.setEnd(elementToPutCursor, offset);
                range.collapse(true);
                range.select();
            })
        });
    }
}
export default new ckEditorWindow();