class ckEditorWindow {
    elements = {
        ckEditableInline: () => cy.get('.cke_editable.cke_editable_inline'),
        saveAndCloseBtn: () => cy.get('.cke_button__leosinlinesaveclose')
    }

    getCkEditableInlineElement() {
        return this.elements.ckEditableInline();
    }

    clickSaveAndCloseBtn(){
        this.elements.saveAndCloseBtn().click();
    }

    clickEnterFromKeyboard(){
        cy.window().then((w) => {
            cy.wait(1000).then(() => {
                let editor = w.CKEDITOR.instances.editor1;
                editor.execCommand('enter');
            })
        });
    }

    appendContentInParagraphInArticle(newContent,paragraphNumber,articleNumber){
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
                range.startContainer.$.appendData(newContent);
                range.setStart(elementToPutCursor, 10);
                range.setEnd(elementToPutCursor, 10);
                range.collapse(true);
                range.select();
            })
        });
    }
}
export default new ckEditorWindow();