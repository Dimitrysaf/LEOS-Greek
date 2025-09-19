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
        numberedListIcon: () => cy.get('.cke_button__numberedlist'),
        bulletedListIcon: () => cy.get('.cke_button__bulletedlist'),
        ckEditorBtn: () => cy.get('a.cke_button'),
        docPurpose: () => this.elements.ckEditableInline().find("p[data-akn-name='docPurpose']"),
        pTag: () => this.elements.ckEditableInline().find('p'),
        level: () => this.elements.ckEditableInline().find("ol li[data-akn-element='level']"),
        paragraph: () => this.elements.ckEditableInline().find("ol li[data-akn-element='paragraph']"),
        article: () => this.elements.ckEditableInline().find('article ol'),
        refTag: () => this.elements.ckEditableInline().find('ref'),
        blockContainer: () => this.elements.ckEditableInline().find("div[data-akn-name='blockContainer']"),
        pTagFromBlockContainer: () => this.elements.blockContainer().find('p'),
        olTagFromBlockContainer: () => this.elements.blockContainer().find('ol'),
        ckEditorDialogHtml: () => cy.get('.cke_dialog_ui_html'),
        ckEditorLeosAlternative1Btn: () => cy.get('.cke_button__leosalternatives1'),
        ckEditorLeosAlternative2Btn: () => cy.get('.cke_button__leosalternatives2'),
        clauseContent: () => this.elements.ckEditableInline().find("#clause1 p[data-akn-mp-id='clause1ContentP']"),
        tcActionIcon: () => cy.get('.cke_combo__trackchangeactions'),
        tcActionDropdown: () => cy.get('ul.cke_panel_list > li.cke_panel_listItem > a')
    }

    uploadImageFile(location, iframeClass) {
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

    clickCkEditorLeosAlternative1Btn() {
        this.elements.ckEditorLeosAlternative1Btn().click();
    }

    clickCkEditorLeosAlternative2Btn() {
        this.elements.ckEditorLeosAlternative2Btn().click();
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

    clickEndFromKeyboardWhenCKEditorOpen() {
        this.elements.ckEditableInline().type('{end}');
    }

    clickRightArrowFromKeyboardWhenCKEditorOpen() {
        this.elements.ckEditableInline().type('{rightarrow}');
    }

    clickDownArrowFromKeyboardWhenCKEditorOpen() {
        this.elements.ckEditableInline().type('{downarrow}');
    }

    clickBackspaceFromKeyboardWhenCKEditorOpen() {
        this.elements.ckEditableInline().type('{backspace}');
    }

    clickSpaceBarFromKeyboardWhenCKEditorOpen() {
        this.elements.ckEditableInline().type(' ');
    }

    clickCtrlAndEnterFromKeyboardWhenCKEditorOpen() {
        this.elements.ckEditableInline().type('{ctrl}{enter}');
    }

    getCkEditableInlineElement() {
        cy.wait(1000);
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

    clickSubScriptIcon() {
        this.elements.subScriptBtn().click();
    }

    clickSuperScriptIcon() {
        this.elements.superScriptBtn().click();
    }

    clickUndoIcon() {
        this.elements.undoBtn().click();
    }

    clickRedoIcon() {
        this.elements.redoBtn().click();
    }

    clickInsertFootNoteIcon() {
        this.elements.insertFootNoteIcon().click();
    }

    clickTableIcon() {
        this.elements.tableIcon().click();
    }

    clickMathIcon() {
        this.elements.mathIcon().click();
    }

    clickBoldIcon() {
        this.elements.boldIcon().click();
    }

    clickSourceIcon() {
        this.elements.sourceBtn().click();
    }

    clickItalicIcon() {
        this.elements.italicIcon().click();
    }

    clickChangeTextCaseIcon() {
        this.elements.changeTextCaseIcon().click();
    }

    clickInsertSpecialCharacterIcon() {
        this.elements.insertSpecialCharacterIcon().click();
    }

    clickInsertImageIcon() {
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

    clickNumberedListIcon() {
        this.elements.numberedListIcon().click();
    }

    clickBulletedListIcon() {
        this.elements.bulletedListIcon().click();
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

    getLiTagFromOlOfBlockContainer(attributeName, attributeValue){
        return this.elements.olTagFromBlockContainer().find("li["+attributeName+"='"+attributeValue+"']");
    }

    getPTagFromBlockContainer(attributeName, attributeValue){
        return this.elements.ckEditableInline().find("p["+attributeName+"='"+attributeValue+"']");
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

    clickAtSpecificOffsetInPTagOfParagraphOfArticle(offset, pTagNumber, paragraphLi, paragraphDataAknElement) {
        this.elements.ckEditableInline().find("article ol li[data-akn-name='aknNumberedParagraph'][data-akn-element='" + paragraphDataAknElement + "']").eq(paragraphLi - 1).find('p').eq(pTagNumber-1).invoke('attr', 'id').then(id => this.moveCursor(offset, "#" + id));
    }

    clickAtSpecificOffsetInSubparagraphOfParagraphOfArticle(offset, pTagNumber, pTagDataAknElement, paragraphLi, paragraphDataAknElement) {
        this.elements.ckEditableInline().find("article ol li[data-akn-name='aknNumberedParagraph'][data-akn-element='" + paragraphDataAknElement + "']").eq(paragraphLi - 1).find("p[data-akn-element='" + pTagDataAknElement + "'").eq(pTagNumber - 1).invoke('attr', 'id').then(id => this.moveCursor(offset, "#" + id));
    }

    clickAtSpecificOffsetOfLiTagOfOlOfBlockContainer(offSet, attributeName, attributeValue) {
        this.getLiTagFromOlOfBlockContainer(attributeName, attributeValue).invoke('attr', 'id').then(id => this.moveCursor(offSet, "#" + id));
    }


    clickAtSpecificOffsetOfPTagOfBlockContainer(offSet, attributeName, attributeValue) {
        this.getPTagFromBlockContainer(attributeName, attributeValue).invoke('attr', 'id').then(id => this.moveCursor(offSet, "#" + id));
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
        return this.elements.ckEditableInline().find("article ol li[data-akn-name='aknNumberedParagraph'][data-akn-element='" + dataAknElement3 + "']").eq(li3 - 1).find("ol li[data-akn-element='" + dataAknElement2 + "']").eq(li2 - 1).find("ol li[data-akn-element='" + dataAknElement2 + "']").eq(li1 - 1);
    }

    getThirdLevelPointOfParagraphOfArticle(li1, dataAknElement1, li2, dataAknElement2, li3, dataAknElement3, li4, dataAknElement4) {
        return this.elements.ckEditableInline().find("article ol li[data-akn-name='aknNumberedParagraph'][data-akn-element='" + dataAknElement4 + "']").eq(li4 - 1).find("ol li[data-akn-element='" + dataAknElement3 + "']").eq(li3 - 1).find("ol li[data-akn-element='" + dataAknElement2 + "']").eq(li2 - 1).find("ol li[data-akn-element='" + dataAknElement1 + "']").eq(li1 - 1);
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

    selectContentInLiOfOlOfBlockContainer(offSetStart, offSetEnd, attributeName, attributeValue){
        this.getLiTagFromOlOfBlockContainer(attributeName, attributeValue).invoke('attr', 'id').then(id => this.selectContent(offSetStart, offSetEnd, "#" + id));
    }

    moveCursorToSpecificOffsetInLevel(offset, pTagNumber) {
        this.elements.ckEditableInline().find('ol li p').eq(pTagNumber - 1).invoke('attr', 'data-akn-mp-id').then(data_akn_mp_id => this.moveCursor(offset, "[data-akn-mp-id='" + data_akn_mp_id + "']"));
    }

    moveCursorToSpecificOffsetInParagraph(offSet) {
        this.elements.paragraph().invoke('attr', 'id').then(id => this.moveCursor(offSet, "[id='" + id + "']"));
    }

    getSubparagraphOfParagraph(liTag, attributeName, attributeValue) {
        return this.elements.paragraph().children('ol').children("li["+attributeName+"='"+attributeValue+"']").eq(liTag - 1);
    }

    rightClickOnSubparagraphOfParagraph(liTag, attributeName, attributeValue) {
        this.getSubparagraphOfParagraph(liTag, attributeName, attributeValue).scrollIntoView().rightclick({ force: true });
    }

    clickAtSpecificOffsetInSubparagraphOfParagraph(offSet, liTag, attributeName, attributeValue) {
        this.getSubparagraphOfParagraph(liTag, attributeName, attributeValue).invoke('attr', 'id').then(id => this.moveCursor(offSet, "[id='" + id + "']"));
    }

    clickOnSubparagraphOfParagraph(liTag, attributeName, attributeValue) {
        this.elements.paragraph().children('ol').children("li["+attributeName+"='"+attributeValue+"']").eq(liTag - 1).click({ force: true });
    }

    rightClickOnFirstLayerElementOfParagraph(liFirstLayerTag, firstLayerAttributeName, firstLayerAttributeValue, liTag, attributeName, attributeValue) {
        this.elements.paragraph().children('ol').children("li["+attributeName+"='"+attributeValue+"']").eq(liTag - 1).children('ol').children("li["+firstLayerAttributeName+"='"+firstLayerAttributeValue+"']").eq(liFirstLayerTag - 1).rightclick({ force: true });
    }

    clickOnFirstLayerElementOfParagraph(liFirstLayerTag, firstLayerAttributeName, firstLayerAttributeValue, liTag, attributeName, attributeValue) {
        this.elements.paragraph().children('ol').children("li["+attributeName+"='"+attributeValue+"']").eq(liTag - 1).children('ol').children("li["+firstLayerAttributeName+"='"+firstLayerAttributeValue+"']").eq(liFirstLayerTag - 1).click({ force: true });
    }

    rightClickOnSecondLayerElementOfParagraph(liSecondLayerTag, secondLayerAttributeName, secondLayerAttributeValue, liFirstLayerTag, firstLayerAttributeName, firstLayerAttributeValue, liTag, attributeName, attributeValue) {
        this.getSecondLayerElementOfParagraph(liSecondLayerTag, secondLayerAttributeName, secondLayerAttributeValue, liFirstLayerTag, firstLayerAttributeName, firstLayerAttributeValue, liTag, attributeName, attributeValue).rightclick({ force: true });
    }

    clickOnSecondLayerElementOfParagraph(liSecondLayerTag, secondLayerAttributeName, secondLayerAttributeValue, liFirstLayerTag, firstLayerAttributeName, firstLayerAttributeValue, liTag, attributeName, attributeValue) {
        this.getSecondLayerElementOfParagraph(liSecondLayerTag, secondLayerAttributeName, secondLayerAttributeValue, liFirstLayerTag, firstLayerAttributeName, firstLayerAttributeValue, liTag, attributeName, attributeValue).click({ force: true });
    }

    rightClickOnThirdLayerElementOfParagraph(liThirdLayerTag, thirdLayerAttributeName, thirdLayerAttributeValue, liSecondLayerTag, secondLayerAttributeName, secondLayerAttributeValue, liFirstLayerTag, firstLayerAttributeName, firstLayerAttributeValue, liTag, attributeName, attributeValue) {
        this.getThirdLayerElementOfParagraph(liThirdLayerTag, thirdLayerAttributeName, thirdLayerAttributeValue, liSecondLayerTag, secondLayerAttributeName, secondLayerAttributeValue, liFirstLayerTag, firstLayerAttributeName, firstLayerAttributeValue, liTag, attributeName, attributeValue).rightclick({ force: true });
    }

    clickOnThirdLayerElementOfParagraph(liThirdLayerTag, thirdLayerAttributeName, thirdLayerAttributeValue, liSecondLayerTag, secondLayerAttributeName, secondLayerAttributeValue, liFirstLayerTag, firstLayerAttributeName, firstLayerAttributeValue, liTag, attributeName, attributeValue) {
        this.getThirdLayerElementOfParagraph(liThirdLayerTag, thirdLayerAttributeName, thirdLayerAttributeValue, liSecondLayerTag, secondLayerAttributeName, secondLayerAttributeValue, liFirstLayerTag, firstLayerAttributeName, firstLayerAttributeValue, liTag, attributeName, attributeValue).click({ force: true });
    }

    getSecondLayerElementOfParagraph(liSecondLayerTag, secondLayerAttributeName, secondLayerAttributeValue, liFirstLayerTag, firstLayerAttributeName, firstLayerAttributeValue, liTag, attributeName, attributeValue){
        return this.elements.paragraph().children('ol').children("li["+attributeName+"='"+attributeValue+"']").eq(liTag - 1).children('ol').children("li["+firstLayerAttributeName+"='"+firstLayerAttributeValue+"']").eq(liFirstLayerTag - 1).children('ol').children("li["+secondLayerAttributeName+"='"+secondLayerAttributeValue+"']").eq(liSecondLayerTag - 1);
    }

    getThirdLayerElementOfParagraph(liThirdLayerTag, thirdLayerAttributeName, thirdLayerAttributeValue, liSecondLayerTag, secondLayerAttributeName, secondLayerAttributeValue, liFirstLayerTag, firstLayerAttributeName, firstLayerAttributeValue, liTag, attributeName, attributeValue){
        return this.getSecondLayerElementOfParagraph(liSecondLayerTag, secondLayerAttributeName, secondLayerAttributeValue, liFirstLayerTag, firstLayerAttributeName, firstLayerAttributeValue, liTag, attributeName, attributeValue).children('ol').children("li["+thirdLayerAttributeName+"='"+thirdLayerAttributeValue+"']").eq(liThirdLayerTag - 1);
    }

    rightClickOnPTagSubparagraphOfLevel(attributeName, attributeValue) {
        this.elements.level().children("p["+attributeName+"='"+attributeValue+"']").rightclick({ force: true });
    }

    clickOnPTagSubparagraphOfLevel(attributeName, attributeValue) {
        this.elements.level().children("p["+attributeName+"='"+attributeValue+"']").click({ force: true });
    }

    rightClickOnSubparagraphOfLevel(liTag, attributeName, attributeValue) {
        this.elements.level().children('ol').children("li["+attributeName+"='"+attributeValue+"']").eq(liTag - 1).rightclick({ force: true });
    }

    clickOnSubparagraphOfLevel(liTag, attributeName, attributeValue) {
        this.elements.level().children('ol').children("li["+attributeName+"='"+attributeValue+"']").eq(liTag - 1).click({ force: true });
    }

    rightClickOnFirstLayerElementOfLevel(liFirstLayerTag, firstLayerAttributeName, firstLayerAttributeValue, liTag, attributeName, attributeValue) {
        this.elements.level().children('ol').children("li["+attributeName+"='"+attributeValue+"']").eq(liTag - 1).children('ol').children("li["+firstLayerAttributeName+"='"+firstLayerAttributeValue+"']").eq(liFirstLayerTag - 1).rightclick({ force: true });
    }

    clickOnFirstLayerElementOfLevel(liFirstLayerTag, firstLayerAttributeName, firstLayerAttributeValue, liTag, attributeName, attributeValue) {
        this.elements.level().children('ol').children("li["+attributeName+"='"+attributeValue+"']").eq(liTag - 1).children('ol').children("li["+firstLayerAttributeName+"='"+firstLayerAttributeValue+"']").eq(liFirstLayerTag - 1).click({ force: true });
    }

    rightClickOnSecondLayerElementOfLevel(liSecondLayerTag, secondLayerAttributeName, secondLayerAttributeValue, liFirstLayerTag, firstLayerAttributeName, firstLayerAttributeValue, liTag, attributeName, attributeValue) {
        this.getSecondLayerElementOfLevel(liSecondLayerTag, secondLayerAttributeName, secondLayerAttributeValue, liFirstLayerTag, firstLayerAttributeName, firstLayerAttributeValue, liTag, attributeName, attributeValue).rightclick({ force: true });
    }

    clickOnSecondLayerElementOfLevel(liSecondLayerTag, secondLayerAttributeName, secondLayerAttributeValue, liFirstLayerTag, firstLayerAttributeName, firstLayerAttributeValue, liTag, attributeName, attributeValue) {
        this.getSecondLayerElementOfLevel(liSecondLayerTag, secondLayerAttributeName, secondLayerAttributeValue, liFirstLayerTag, firstLayerAttributeName, firstLayerAttributeValue, liTag, attributeName, attributeValue).click({ force: true });
    }

    rightClickOnThirdLayerElementOfLevel(liThirdLayerTag, thirdLayerAttributeName, thirdLayerAttributeValue, liSecondLayerTag, secondLayerAttributeName, secondLayerAttributeValue, liFirstLayerTag, firstLayerAttributeName, firstLayerAttributeValue, liTag, attributeName, attributeValue) {
        this.getThirdLayerElementOfLevel(liThirdLayerTag, thirdLayerAttributeName, thirdLayerAttributeValue, liSecondLayerTag, secondLayerAttributeName, secondLayerAttributeValue, liFirstLayerTag, firstLayerAttributeName, firstLayerAttributeValue, liTag, attributeName, attributeValue).rightclick({ force: true });
    }

    clickOnThirdLayerElementOfLevel(liThirdLayerTag, thirdLayerAttributeName, thirdLayerAttributeValue, liSecondLayerTag, secondLayerAttributeName, secondLayerAttributeValue, liFirstLayerTag, firstLayerAttributeName, firstLayerAttributeValue, liTag, attributeName, attributeValue) {
        this.getThirdLayerElementOfLevel(liThirdLayerTag, thirdLayerAttributeName, thirdLayerAttributeValue, liSecondLayerTag, secondLayerAttributeName, secondLayerAttributeValue, liFirstLayerTag, firstLayerAttributeName, firstLayerAttributeValue, liTag, attributeName, attributeValue).click({ force: true });
    }

    getSecondLayerElementOfLevel(liSecondLayerTag, secondLayerAttributeName, secondLayerAttributeValue, liFirstLayerTag, firstLayerAttributeName, firstLayerAttributeValue, liTag, attributeName, attributeValue){
        return this.elements.level().children('ol').children("li["+attributeName+"='"+attributeValue+"']").eq(liTag - 1).children('ol').children("li["+firstLayerAttributeName+"='"+firstLayerAttributeValue+"']").eq(liFirstLayerTag - 1).children('ol').children("li["+secondLayerAttributeName+"='"+secondLayerAttributeValue+"']").eq(liSecondLayerTag - 1);
    }

    getThirdLayerElementOfLevel(liThirdLayerTag, thirdLayerAttributeName, thirdLayerAttributeValue, liSecondLayerTag, secondLayerAttributeName, secondLayerAttributeValue, liFirstLayerTag, firstLayerAttributeName, firstLayerAttributeValue, liTag, attributeName, attributeValue){
        return this.getSecondLayerElementOfLevel(liSecondLayerTag, secondLayerAttributeName, secondLayerAttributeValue, liFirstLayerTag, firstLayerAttributeName, firstLayerAttributeValue, liTag, attributeName, attributeValue).children('ol').children("li["+thirdLayerAttributeName+"='"+thirdLayerAttributeValue+"']").eq(liThirdLayerTag - 1);
    }

    moveCursorToSpecificOffsetInFSLevel(offset, pTagNumber) {
        this.elements.ckEditableInline()
            .find('ol li p')
            .eq(pTagNumber - 1)
            .then($el => {
                const id = $el.attr("id") || $el.attr("data-akn-mp-id");
                if (id) {
                    this.moveCursor(offset, `[id='${id}'], [data-akn-mp-id='${id}']`);
                }
            });
    }

    getElementPTagOfLevel(pTagNumber) {
        return this.elements.level().find('p').eq(pTagNumber - 1);
    }

    getParagraph() {
        return this.elements.paragraph();
    }

    getElementLiTagOfLevel() {
        return this.elements.ckEditableInline().find("ol[data-akn-element='level']").find("li[data-akn-element='level']");
    }

    addContentInSubParagraphOfLevel(content, pTagNumber) {
        this.getElementLiTagOfLevel().find("p[data-akn-element='subparagraph']").eq(pTagNumber - 1).type(content);
    }

    clickAtSpecificOffsetInSubparagraphOfLevel(offSet, pTagNumber, dataAknElement1, dataAknElement2, dataAknElement3) {
        this.elements.ckEditableInline().find("ol[data-akn-element=" + dataAknElement3 + "]").find("li[data-akn-element='" + dataAknElement2 + "']").find("p[data-akn-element='" + dataAknElement1 + "']").eq(pTagNumber - 1).invoke('attr', 'data-akn-mp-id').then(data_akn_mp_id => this.moveCursor(offSet, "[data-akn-mp-id='" + data_akn_mp_id + "']"));
    }

    clickAtSpecificOffsetInPTagOfLevel(offSet, pTagNumber) {
        this.elements.level().children('p').eq(pTagNumber-1)
            .then($el => {
                const id = $el.attr("id") || $el.attr("data-akn-mp-id");
                if (id) {
                    this.moveCursor(offSet, `[id='${id}'], [data-akn-mp-id='${id}']`);
                }
            });
    }

    clickAtSpecificOffsetInParagraph(offSet, paragraphLi, dataAknElement) {
        this.elements.ckEditableInline().find("ol li[data-akn-name='aknNumberedParagraph'][data-akn-element='" + dataAknElement + "']").eq(paragraphLi - 1).invoke('attr', 'data-akn-mp-id').then(data_akn_mp_id => this.moveCursor(offSet, "[data-akn-mp-id='" + data_akn_mp_id + "']"));
    }

    clickAtSpecificOffsetInSpanOfFirstLayerPointInLevel(offSet, spanAttributeName, spanAttributeValue, LiTag1Number, LiTag1AttributeName, LiTag1AttributeValue) {
        this.elements.level().children("ol li["+LiTag1AttributeName+"='"+LiTag1AttributeValue+"']").eq(LiTag1Number-1).children("span["+spanAttributeName+"='"+spanAttributeValue+"']").invoke('attr', 'id').then(id => this.moveCursor(offSet, "[id='" + id + "']"));
    }

    clickAtSpecificOffsetInSpanOfSecondLayerPointInLevel(offSet, spanAttributeName, spanAttributeValue, LiTag2Number, LiTag2AttributeName, LiTag2AttributeValue, LiTag1Number) {
        this.elements.level().children('ol').children('li').eq(LiTag1Number-1).children('ol').children("li["+LiTag2AttributeName+"='"+LiTag2AttributeValue+"']").eq(LiTag2Number-1).children("span["+spanAttributeName+"='"+spanAttributeValue+"']").invoke('attr', 'id').then(id => this.moveCursor(offSet, "[id='" + id + "']"));
    }

    clickAtSpecificOffsetInSpanOfThirdLayerPointInLevel(offSet, spanAttributeName, spanAttributeValue, LiTag3Number, LiTag3AttributeName, LiTag3AttributeValue, LiTag2Number, LiTag1Number) {
        this.elements.level().children('ol').children('li').eq(LiTag1Number-1).children('ol').children('li').eq(LiTag2Number-1).children('ol').children("li["+LiTag3AttributeName+"='"+LiTag3AttributeValue+"']").eq(LiTag3Number-1).children("span["+spanAttributeName+"='"+spanAttributeValue+"']").invoke('attr', 'id').then(id => this.moveCursor(offSet, "[id='" + id + "']"));
    }

    clickAtSpecificOffsetInSpanOfFourthLayerPointInLevel(offSet, spanAttributeName, spanAttributeValue, LiTag4Number, LiTag4AttributeName, LiTag4AttributeValue, LiTag3Number, LiTag2Number, LiTag1Number) {
        this.elements.level().children('ol').children('li').eq(LiTag1Number-1).children('ol').children('li').eq(LiTag2Number-1).children('ol').children('li').eq(LiTag3Number-1).children('ol').children("li["+LiTag4AttributeName+"='"+LiTag4AttributeValue+"']").eq(LiTag4Number-1).children("span["+spanAttributeName+"='"+spanAttributeValue+"']").invoke('attr', 'id').then(id => this.moveCursor(offSet, "[id='" + id + "']"));
    }

    getRefTag(count) {
        return this.elements.refTag().eq(count - 1);
    }

    clickInterReferenceLink(count) {
        this.elements.refTag().eq(count - 1).dblclick();
    }

    clickAtCellInRowInTableOfParagraph(cell, row, table, paragraphLi, dataAknElement) {
        this.elements.ckEditableInline().find("ol li[data-akn-name='aknNumberedParagraph'][data-akn-element='" + dataAknElement + "']").eq(paragraphLi - 1).find("table tbody").eq(table - 1).find('tr').eq(row - 1).find('td').eq(cell - 1).click();
    }

    getHeadingOfLevel() {
        return this.getElementLiTagOfLevel().find('h2 strong');
    }

    getAuthorialNoteWithMarkerNumber(markerNumber) {
        return this.elements.pTag().find("span.authorialnote[marker='" + markerNumber + "']");
    }

    getTagElementFromParagraphOfArticle(paragraphNumber, tagName) {
        return this.getParagraphElementOfArticle(paragraphNumber, 'paragraph').find(tagName);
    }

    getAuthorialNoteWithMarkerNumberFromParagraphOfArticle(paragraphNumber, markerNumber) {
        return this.getParagraphElementOfArticle(paragraphNumber, 'paragraph').find("span.authorialnote[marker='" + markerNumber + "']");
    }

    clickTrackChangesActionPlugin() {
        this.elements.tcActionIcon().click()
    }

    getIframeBodyTcPlugin() {
        return cy.get('iframe.cke_panel_frame').its('0.contentDocument.body').should('not.be.empty').then(cy.wrap);
    }

    getCkePanelListItem(){
        return this.getIframeBodyTcPlugin().find('ul.cke_panel_list > li.cke_panel_listItem');
    }

    clickAcceptAll() {
        this.elements.tcActionDropdown().contains('Accept All').click({ force: true });
    }

    clickRejectAll() {
        this.elements.tcActionDropdown().contains('Reject All').click({ force: true });
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
                this.elements.ckEditableInline().type('{insert}' + newContent, {delay: 0});
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
                    this.elements.ckEditableInline().type('{' + key + '}', {delay: 0});
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