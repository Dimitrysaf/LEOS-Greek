class ckEditorWindow {
    elements = {
        ckEditableInline: () => cy.get('.cke_editable.cke_editable_inline'),
        saveAndCloseBtn: () => cy.get('.cke_button__leosinlinesaveclose'),
        closeBtn: () => cy.get('.cke_button__leosinlinecancel'),
        saveBtn: () => cy.get('.cke_button__leosinlinesave'),
        undoBtn: () => cy.get('.cke_button__undo'),
        redoBtn: () => cy.get('.cke_button__redo'),
        cutBtn: () => cy.get('.cke_button__cut'),
        copyBtn: () => cy.get('.cke_button__copy'),
        pasteBtn: () => cy.get('.cke_button__paste'),
        subScriptBtn: () => cy.get('.cke_button__subscript'),
        superScriptBtn: () => cy.get('.cke_button__superscript'),
        insertSpecialCharacterIcon: () => cy.get('.cke_button__specialchar'),
        insertImageIcon: () => cy.get('.cke_button__base64image'),
        showBlockBtn: () => cy.get('.cke_button__leosshowblocks'),
        sourceBtn: () => cy.get('.cke_button__sourcedialog'),
        internalReferenceIcon: () => cy.get('a.cke_button__leoscrossreference'),
        paragraphModeIcon: () => cy.get('a.cke_button__aknnumberedparagraph'),
        increaseIndentIcon: () => cy.get('.cke_button__indent'),
        decreaseIndentIcon: () => cy.get('.cke_button__outdent'),
        softEnterIcon: () => cy.get('.cke_button__leoshierarchicalelementshiftenterhandler'),
        addSubParagraphIcon: () => cy.get('.cke_button__leoshierarchicalelementsubparagraphafterlastpoint'),
        insertFootNoteIcon: () => cy.get('.cke_button__authorialnotewidget'),
        tableIcon: () => cy.get('.cke_button__table'),
        mathIcon: () => cy.get('.cke_button__mathjax'),
        boldIcon: () => cy.get('.cke_button__bold'),
        italicIcon: () => cy.get('.cke_button__italic'),
        changeTextCaseIcon: () => cy.get('.cke_button__transformtextswitcher'),
        //backgroundColorBtn: () => cy.get('.cke_button__bgcolor'),
        ckEditorBtn: () => cy.get('a.cke_button'),
        docPurpose: () => this.elements.ckEditableInline().find("p[data-akn-name='docPurpose']"),
        pTag: () => this.elements.ckEditableInline().find('p'),
        ckEditorDialogHtml: () => cy.get('.cke_dialog_ui_html'),
        ckEditorDialogOkBtn: () => cy.get('.cke_dialog_ui_button_ok'),
    }

    uploadImageFile(location, iframeClass){
        const iframe = cy.get("." + iframeClass).eq(1).its('0.contentDocument.body').then(cy.wrap);
        iframe.find("input[type='file']").invoke('show').selectFile(location).wait(200);
    }

    replaceContentInDocPurpose(content) {
        this.elements.docPurpose().type('{selectall}{del}');
        this.elements.docPurpose().type(content);
    }
    getCkEditorDialogHtml() {
        return this.elements.ckEditorDialogHtml();
    }

    clickCkEditorDialogOkBtn() {
        this.elements.ckEditorDialogOkBtn().click();
    }

    addTextAtCurrentCursorPositionWhenCKEditorOpen(newContent) {
        this.elements.ckEditableInline().type('{insert}' + newContent);
    }

    clickDeleteFromKeyboardWhenCKEditorOpen() {
        this.elements.ckEditableInline().type('{del}');
    }

    clickEnterFromKeyboardWhenCKEditorOpen() {
        this.elements.ckEditableInline().type('{enter}');
    }

    clickBackspaceFromKeyboardWhenCKEditorOpen() {
        this.elements.ckEditableInline().type('{backspace}');
    }

    clickSpaceBarFromKeyboardWhenCKEditorOpen() {
        this.elements.ckEditableInline().type(' ');
    }

    getCkEditableInlineElement() {
        cy.wait(500);
        return this.elements.ckEditableInline();
    }

    clickSaveAndCloseBtn() {
        this.elements.saveAndCloseBtn().click();
        cy.wait(2000);
    }

    clickCloseBtn() {
        this.elements.closeBtn().click();
    }

    clickParagraphModeIcon() {
        this.elements.paragraphModeIcon().click();
    }

    clickTwoTimesParagraphModeIcon() {
        this.elements.paragraphModeIcon().click().click();
    }

    clickIncreaseIndentIcon() {
        this.elements.increaseIndentIcon().click();
    }

    clickSubScriptIcon(){
        this.elements.subScriptBtn().click();
    }

    clickSuperScriptIcon(){
        this.elements.superScriptBtn().click();
    }

    clickUndoIcon(){
        this.elements.undoBtn().click();
    }

    clickRedoIcon(){
        this.elements.redoBtn().click();
    }

    clickInsertFootNoteIcon(){
        this.elements.insertFootNoteIcon().click();
    }

    clickTableIcon(){
        this.elements.tableIcon().click();
    }

    clickMathIcon(){
        this.elements.mathIcon().click();
    }

    clickBoldIcon(){
        this.elements.boldIcon().click();
    }

    clickItalicIcon(){
        this.elements.italicIcon().click();
    }

    clickChangeTextCaseIcon(){
        this.elements.changeTextCaseIcon().click();
    }

    clickInsertSpecialCharacterIcon(){
        this.elements.insertSpecialCharacterIcon().click();
    }

    clickInsertImageIcon(){
        this.elements.insertImageIcon().click();
    }

    clickDecreaseIndentIcon() {
        this.elements.decreaseIndentIcon().click();
    }

    clickSoftEnterIcon() {
        this.elements.softEnterIcon().click();
    }

    clickAddSubParagraphIcon() {
        this.elements.addSubParagraphIcon().click();
    }

    clickInternalReferenceIcon() {
        this.elements.internalReferenceIcon().click();
    }

    clickCopyIcon() {
        this.elements.copyBtn().click();
    }

    clickCutIcon() {
        this.elements.cutBtn().click();
    }

/*    clickBackgroundColorIcon() {
        this.elements.backgroundColorBtn().click();
    }*/

    appendInCkEditorLevel(text, pTagNumber) {
        this.elements.ckEditableInline().find('ol li p').eq(pTagNumber - 1).type(text);
    }

    getRecitalOfNumber(recitalNumber) {
        return this.elements.ckEditableInline().find("p[data-akn-name='recital'][data-akn-num='" + recitalNumber + "']");
    }

    getNumberedParagraphElementOfArticle(paragraphNumber) {
        return this.elements.ckEditableInline().find("article li[data-akn-element='paragraph'][data-akn-num='" + paragraphNumber + ".']");
    }

    getAllParagraphElementsOfArticle() {
        return this.elements.ckEditableInline().find("article ol li[data-akn-name='aknNumberedParagraph'][data-akn-element='paragraph']");
    }

    getParagraphElementOfArticle(li, dataAknElement) {
        return this.elements.ckEditableInline().find("article ol li[data-akn-name='aknNumberedParagraph'][data-akn-element='" + dataAknElement + "']").eq(li - 1);
    }

    getPointOfParagraphOfArticle(pointLi, pointDataAknElement, paragraphLi, paragraphDataAknElement) {
        return this.elements.ckEditableInline().find("article ol li[data-akn-name='aknNumberedParagraph'][data-akn-element='" + paragraphDataAknElement + "']").eq(paragraphLi - 1).find("ol li[data-akn-element='" + pointDataAknElement + "']").eq(pointLi - 1);
    }

    getElementPTagOfParagraphOfArticle(pTag, paragraphLi, paragraphDataAknElement) {
        return this.elements.ckEditableInline().find("article ol li[data-akn-name='aknNumberedParagraph'][data-akn-element='" + paragraphDataAknElement + "']").eq(paragraphLi - 1).find('p').eq(pTag - 1);
    }

    getElementPTagOfPointOfParagraphOfArticle(pTag, pointLi, pointDataAknElement, paragraphLi, paragraphDataAknElement) {
        return this.getPointOfParagraphOfArticle(pointLi, pointDataAknElement, paragraphLi, paragraphDataAknElement).find('p').eq(pTag - 1);
    }

    moveCursorToSpecificOffsetInParagraphOfArticle(offset, paragraphNumber) {
        this.elements.ckEditableInline().find("article ol li[data-akn-name='aknNumberedParagraph'][data-akn-num='" + paragraphNumber + ".']").invoke('attr', 'id').then(id => this.moveCursor(offset, "#" + id));
    }

    clickAtSpecificOffsetInChildOfCitation(offset, child) {
        this.moveCursor(offset, "[data-akn-name=citation]", child);
    }

    clickAtSpecificOffsetInChildOfRecital(offset, child) {
        this.moveCursor(offset, "[data-akn-name=recital]", child);
    }

    clickAtSpecificOffsetInParagraphOfArticle(offset, paragraphLi, paragraphDataAknElement) {
        this.elements.ckEditableInline().find("article ol li[data-akn-name='aknNumberedParagraph'][data-akn-element='" + paragraphDataAknElement + "']").eq(paragraphLi - 1).invoke('attr', 'id').then(id => this.moveCursor(offset, "#" + id));
    }

    clickAtSpecificOffsetInChildOfParagraphOfArticle(offset, child, paragraphLi, paragraphDataAknElement) {
        this.elements.ckEditableInline().find("article ol li[data-akn-name='aknNumberedParagraph'][data-akn-element='" + paragraphDataAknElement + "']").eq(paragraphLi - 1).invoke('attr', 'id').then(id => this.moveCursor(offset, "#" + id, child));
    }

    moveCursorToSpecificOffsetInPointOfParagraphOfArticle(pointOffset, pointLi, pointDataAknElement, paragraphLi, paragraphDataAknElement) {
        this.getPointOfParagraphOfArticle(pointLi, pointDataAknElement, paragraphLi, paragraphDataAknElement).invoke('attr', 'id').then(id => this.moveCursor(pointOffset, "#" + id));
    }

    moveCursorToSpecificOffsetInPTagOfPointOfParagraphOfArticle(pointOffset, pTag, pointLi, pointDataAknElement, paragraphLi, paragraphDataAknElement) {
        this.getPointOfParagraphOfArticle(pointLi, pointDataAknElement, paragraphLi, paragraphDataAknElement).find('p').eq(pTag - 1).invoke('attr', 'id').then(id => this.moveCursor(pointOffset, "#" + id));
    }

    appendContentInParagraphOfArticle(newContent, offset, paragraphNumber, child) {
        this.elements.ckEditableInline().find("article ol li[data-akn-name='aknNumberedParagraph'][data-akn-num='" + paragraphNumber + ".']").invoke('attr', 'id').then(id => this.addContent(newContent, offset, "#" + id, child));
    }

    addContentInParagraphOfArticle(newContent, li, dataAknElement) {
        this.elements.ckEditableInline().find("article ol li[data-akn-name='aknNumberedParagraph'][data-akn-element='" + dataAknElement + "']").eq(li - 1).type(newContent);
    }

    addContentInPointOfParagraphOfArticle(newContent, pointLi, pointDataAknElement, paragraphLi, paragraphDataAknElement) {
        this.getPointOfParagraphOfArticle(pointLi, pointDataAknElement, paragraphLi, paragraphDataAknElement).type(newContent);
    }

    addContentInSecondLayerPointOfParagraphOfArticle(newContent, li1, dataAknElement1, li2, dataAknElement2, li3, dataAknElement3) {
        this.elements.ckEditableInline().find("article ol li[data-akn-name='aknNumberedParagraph'][data-akn-element='" + dataAknElement3 + "']").eq(li3 - 1).find("ol li[data-akn-element='" + dataAknElement2 + "']").eq(li2 - 1).find("ol li[data-akn-element='" + dataAknElement1 + "']").eq(li1 - 1).type(newContent);
    }

    getSecondLevelPointOfParagraphOfArticle(li1, dataAknElement1, li2, dataAknElement2, li3, dataAknElement3) {
        return  this.elements.ckEditableInline().find("article ol li[data-akn-name='aknNumberedParagraph'][data-akn-element='" + dataAknElement3 + "']").eq(li3 - 1).find("ol li[data-akn-element='" + dataAknElement2 + "']").eq(li2 - 1).find("ol li[data-akn-element='" + dataAknElement2 + "']").eq(li1 - 1);
    }

    getThirdLevelPointOfParagraphOfArticle(li1, dataAknElement1, li2, dataAknElement2, li3, dataAknElement3, li4, dataAknElement4) {
       return  this.elements.ckEditableInline().find("article ol li[data-akn-name='aknNumberedParagraph'][data-akn-element='" + dataAknElement4 + "']").eq(li4 - 1).find("ol li[data-akn-element='" + dataAknElement3 + "']").eq(li3 - 1).find("ol li[data-akn-element='" + dataAknElement2 + "']").eq(li2 - 1).find("ol li[data-akn-element='" + dataAknElement1 + "']").eq(li1 - 1);
    }

    addContentInThirdLayerPointOfParagraphOfArticle(newContent, li1, dataAknElement1, li2, dataAknElement2, li3, dataAknElement3, li4, dataAknElement4) {
        this.getThirdLevelPointOfParagraphOfArticle(li1, dataAknElement1, li2, dataAknElement2, li3, dataAknElement3, li4, dataAknElement4).type(newContent);
    }

    getFourthLevelPointOfParagraphOfArticle(li1, dataAknElement1, li2, dataAknElement2, li3, dataAknElement3, li4, dataAknElement4, li5, dataAknElement5) {
        return this.elements.ckEditableInline().find("article ol li[data-akn-name='aknNumberedParagraph'][data-akn-element='" + dataAknElement5 + "']").eq(li5 - 1).find("ol li[data-akn-element='" + dataAknElement4 + "']").eq(li4 - 1).find("ol li[data-akn-element='" + dataAknElement3 + "']").eq(li3 - 1).find("ol li[data-akn-element='" + dataAknElement2 + "']").eq(li2 - 1).find("ol li[data-akn-element='" + dataAknElement1 + "']").eq(li1 - 1);
    }

    addContentInFourthLayerPointOfParagraphOfArticle(newContent, li1, dataAknElement1, li2, dataAknElement2, li3, dataAknElement3, li4, dataAknElement4, li5, dataAknElement5) {
        this.getFourthLevelPointOfParagraphOfArticle(li1, dataAknElement1, li2, dataAknElement2, li3, dataAknElement3, li4, dataAknElement4, li5, dataAknElement5).type(newContent);
    }

    selectContentInFourthLayerPointOfParagraphOfArticle(offsetStart, offsetEnd, li1, dataAknElement1, li2, dataAknElement2, li3, dataAknElement3, li4, dataAknElement4, li5, dataAknElement5) {
        this.getFourthLevelPointOfParagraphOfArticle(li1, dataAknElement1, li2, dataAknElement2, li3, dataAknElement3, li4, dataAknElement4, li5, dataAknElement5).invoke('attr', 'id').then(id => this.selectContent(offsetStart, offsetEnd, "#" + id));
    }

    deleteContentInNumberedParagraphOfArticle(key, offset, paragraphNumber, child, times) {
        this.elements.ckEditableInline().find("article ol li[data-akn-name='aknNumberedParagraph'][data-akn-num='" + paragraphNumber + ".']").invoke('attr', 'id').then(id => this.pressSpecialKey(key, offset, "#" + id, child, times));
    }

    addContentInParagraph(newContent, offset) {
        this.addContent(newContent, offset, "[data-akn-name=aknNumberedParagraph]");
    }

    addContentInCitation(newContent, offset) {
        this.addContent(newContent, offset, "[data-akn-name=citation]");
    }

    addContentInRecital(newContent, offset) {
        this.addContent(newContent, offset, "[data-akn-name=recital]");
    }

    selectContentInParagraph(offsetStart, offsetEnd) {
        this.selectContent(offsetStart, offsetEnd, "[data-akn-name=aknNumberedParagraph]");
    }

    selectContentInCitation(offsetStart, offsetEnd) {
        this.selectContent(offsetStart, offsetEnd, "[data-akn-name=citation]");
    }

    selectContentInRecital(offsetStart, offsetEnd) {
        this.selectContent(offsetStart, offsetEnd, "[data-akn-name=recital]");
    }

    selectContentInNumberedParagraphOfArticle(offsetStart, offsetEnd, paragraphNumber) {
        this.elements.ckEditableInline().find("article ol li[data-akn-name='aknNumberedParagraph'][data-akn-num='" + paragraphNumber + ".']").invoke('attr', 'id').then(id => this.selectContent(offsetStart, offsetEnd, "#" + id));
    }

    selectContentInLevel(offsetStart, offsetEnd, pTagNumber) {
        this.elements.ckEditableInline().find('ol li p').eq(pTagNumber - 1).invoke('attr', 'data-akn-mp-id').then(data_akn_mp_id => this.selectContent(offsetStart, offsetEnd, "[data-akn-mp-id='" + data_akn_mp_id + "']"));
    }

    moveCursorToSpecificOffsetInLevel(offset, pTagNumber) {
        this.elements.ckEditableInline().find('ol li p').eq(pTagNumber - 1).invoke('attr', 'data-akn-mp-id').then(data_akn_mp_id => this.moveCursor(offset, "[data-akn-mp-id='" + data_akn_mp_id + "']"));
    }

    getElementPTagOfLevel(pTagNumber) {
        return this.elements.ckEditableInline().find('ol li p').eq(pTagNumber - 1);
    }

    addContentInSubParagraphOfLevel(content, pTagNumber) {
        this.elements.ckEditableInline().find("ol[data-akn-element='level']").find("li[data-akn-element='level']").find("p[data-akn-element='subparagraph']").eq(pTagNumber - 1).type(content);
    }

    clickAtSpecificOffsetInSubparagraphOfLevel(offSet, pTagNumber, dataAknElement1, dataAknElement2, dataAknElement3) {
        this.elements.ckEditableInline().find("ol[data-akn-element="+dataAknElement3+"]").find("li[data-akn-element='"+dataAknElement2+"']").find("p[data-akn-element='"+dataAknElement1+"']").eq(pTagNumber - 1).invoke('attr', 'data-akn-mp-id').then(data_akn_mp_id => this.moveCursor(offSet, "[data-akn-mp-id='" + data_akn_mp_id + "']"));
    }

    getHeadingOfLevel() {
        return this.elements.ckEditableInline().find("ol[data-akn-element='level']").find("li[data-akn-element='level']").find('h2 strong');
    }

    getAuthorialNoteWithMarkerNumber(markerNumber) {
        return this.elements.pTag().find("span.authorialnote[marker='"+markerNumber+"']");
    }

    getTagElementFromParagraphOfArticle(paragraphNumber, tagName) {
        return this.getParagraphElementOfArticle(paragraphNumber, 'paragraph').find(tagName);
    }

    getAuthorialNoteWithMarkerNumberFromParagraphOfArticle(paragraphNumber, markerNumber) {
        return this.getParagraphElementOfArticle(paragraphNumber, 'paragraph').find("span.authorialnote[marker='"+markerNumber+"']");
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
                this.elements.ckEditableInline().type('{insert}' + newContent, { delay: 0 });
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
                    this.elements.ckEditableInline().type('{' + key + '}', { delay: 0 });
                }
                editor.fire("change");
            })
        });
    }

    moveCursor(offset, element, child) {
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
            })
        });
    }
}
export default new ckEditorWindow();