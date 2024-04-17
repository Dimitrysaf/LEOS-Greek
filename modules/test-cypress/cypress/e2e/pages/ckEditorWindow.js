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

    getCkEditableInlineElement() {
        return this.elements.ckEditableInline();
    }

    clickSaveAndCloseBtn(){
        this.elements.saveAndCloseBtn().click();
    }

    clickCloseBtn(){
        this.elements.closeBtn().click();
    }

    clickSaveBtn(){
        this.elements.saveBtn().click();
    }

    appendContentInParagraphInArticle(newContent,paragraphNumber,articleNumber){
        cy.window().then((w) => {
            cy.wait(1000).then(() => {
                let editor = w.CKEDITOR.instances[Object.keys(w.CKEDITOR.instances)[0]];
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
    addContentInCitation(newContent, offset, citationNumber){
        cy.window().then((w) => {
            cy.wait(1000).then(() => {
                let editor = w.CKEDITOR.instances[Object.keys(w.CKEDITOR.instances)[0]];
                let elementToPutCursorParent = editor.element.findOne("#_cit_"+citationNumber);
                let elementToPutCursor = elementToPutCursorParent.getChild(0);
                let range = editor.createRange();
                range.moveToPosition(elementToPutCursor, w.CKEDITOR.POSITION_AFTER_START);
                range.setStart(elementToPutCursor, offset);
                range.setEnd(elementToPutCursor, offset);
                range.collapse(true);
                range.select();
                editor.fire("change");
                //range.startContainer.$.appendData(newContent);
            })
        });    
    }

    selectContentInCitation(offsetStart, offsetEnd, citationNumber){
        cy.window().then((w) => {
            cy.wait(1000).then(() => {
                let editor = w.CKEDITOR.instances[Object.keys(w.CKEDITOR.instances)[0]];
                let elementToPutCursorParent = editor.element.findOne("#_cit_"+citationNumber);
                let elementToPutCursor = elementToPutCursorParent.getChild(0);
                let range = editor.createRange();
                range.moveToPosition(elementToPutCursor, w.CKEDITOR.POSITION_AFTER_START);
                range.setStart(elementToPutCursor, offsetStart);
                range.setEnd(elementToPutCursor, offsetEnd);
                range.select();
            })
        }); 
    }

    selectContentInRecital(offsetStart, offsetEnd, recitalNumber){ 
        cy.window().then((w) => {
            cy.wait(1000).then(() => {
                let editor = w.CKEDITOR.instances[Object.keys(w.CKEDITOR.instances)[0]];
                let elementToPutCursorParent = editor.element.findOne("#_rec_"+recitalNumber);
                let elementToPutCursor = elementToPutCursorParent.getChild(0);
                let range = editor.createRange();
                range.moveToPosition(elementToPutCursor, w.CKEDITOR.POSITION_AFTER_START);
                range.setStart(elementToPutCursor, offsetStart);
                range.setEnd(elementToPutCursor, offsetEnd);
                range.select();
            })
        });
    }

    addContentInRecital(newContent, offset, recitalNumber){
        cy.window().then((w) => {
            cy.wait(1000).then(() => {
                let editor = w.CKEDITOR.instances[Object.keys(w.CKEDITOR.instances)[0]];
                let elementToPutCursorParent = editor.element.findOne("#_rec_"+recitalNumber);
                let elementToPutCursor = elementToPutCursorParent.getChild(0);
                let range = editor.createRange();
                range.moveToPosition(elementToPutCursor, w.CKEDITOR.POSITION_AFTER_START);
                range.setStart(elementToPutCursor, offset);
                range.setEnd(elementToPutCursor, offset);
                range.collapse(true);
                range.select();
                range.startContainer.$.appendData(newContent);
            })
        });    
    }

    clickDeleteFromKeyboardWhenCKEditorOpen(){
        cy.get('.cke_editable.cke_editable_inline').type('{del}');
    }

    clickEnterFromKeyboardWhenCKEditorOpen(){
        // cy.window().then((w) => {
        //     cy.wait(1000).then(() => {
        //         let editor = w.CKEDITOR.instances.editor1;
        //         editor.execCommand('enter');
        //     })
        // });
        cy.get('.cke_editable.cke_editable_inline').type('{enter}');
    }

}
export default new ckEditorWindow();