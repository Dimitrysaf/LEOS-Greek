class importOfficeJournalWindow {
    elements = {
        closeBtn: () => cy.get("div[role='dialog'] button.eui-button--rounded"),
        typeDropdown: () => cy.get('select#type'),
        typeDropDownOption: () => this.elements.typeDropdown().find('option'),
        yearDropdown: () => cy.get('select#year'),
        nr: () => cy.get('input#number'),
        searchBtn: () => cy.get("button[type='submit']"),
        exclamationMark: () => cy.get("*[icon='eui-alert-circle']"),
        importContent: () => cy.get('#akomaNtoso'),
        bill: () => this.elements.importContent().find('bill'),
        preamble: () => this.elements.bill().find('preamble'),
        aknBody: () => this.elements.bill().find('aknbody'),
        recitals: () => this.elements.preamble().find('recitals'),
        recital: () => this.elements.recitals().find(' .leos-import-wrapper'),
        leosImportWrapper: () => this.elements.aknBody().find('.leos-import-wrapper'),
        importBtn: () => cy.get('.eui-dialog__footer-content button').contains('Import'),
        selectAllRecitalsBtn: () => cy.get(".app-u-gap-s button").eq(0),
        selectAllEnactingItemsBtn: () => cy.get(".app-u-gap-s button").eq(1),
        checkBoxInputRecital: () => this.elements.recital().find('input'),
        checkBoxInputPart: () => this.elements.leosImportWrapper().find("input[data-wrapped-type='part']"),
        checkBoxInputTitle: () => this.elements.leosImportWrapper().find("input[data-wrapped-type='title']"),
        checkBoxInputChapter: () => this.elements.leosImportWrapper().find("input[data-wrapped-type='chapter']"),
        checkBoxInputSection: () => this.elements.leosImportWrapper().find("input[data-wrapped-type='section']"),
        checkBoxInputArticle: () => this.elements.leosImportWrapper().find("input[data-wrapped-type='article']"),
        checkedRecitals: () => this.elements.recital().find('input:checked'),
        checkedParts: () => this.elements.leosImportWrapper().find("input[data-wrapped-type='part']:checked"),
        checkedTitles: () => this.elements.leosImportWrapper().find("input[data-wrapped-type='title']:checked"),
        checkedChapters: () => this.elements.leosImportWrapper().find("input[data-wrapped-type='chapter']:checked"),
        checkedSections: () => this.elements.leosImportWrapper().find("input[data-wrapped-type='section']:checked"),
        checkedArticles: () => this.elements.leosImportWrapper().find("input[data-wrapped-type='article']:checked")
    }

    clickPartCheckBox(partNumber){
        this.elements.checkBoxInputPart().eq(partNumber -1).click()
    }

    clickTypeField(){
        this.elements.typeDropdown().trigger('click');
    }

    clickSearchBtn(){
        this.elements.searchBtn().click();
    }

    selectFromTypeFieldByVisibleText(option){
        this.elements.typeDropdown().select(option);
    }

    selectFromYearFieldByVisibleText(option){
        this.elements.yearDropdown().select(option);
    }

    typeNrField(value){
        this.elements.nr().clear().type(value);
    }

    clickRecitalCheckBox(recitalNumber){
        this.elements.recital().eq(recitalNumber-1).find('input').click();
    }

    clickArticleCheckBox(articleNumber){
        this.elements.checkBoxInputArticle().eq(articleNumber-1).click();
    }

    clickImportBtn(){
        this.elements.importBtn().click();
        cy.wait(5000);
    }

    clickSelectAllRecitalsBtn(){
        this.elements.selectAllRecitalsBtn().realHover().click();
    }

    clickSelectAllEnactingItemsBtn(){
        this.elements.selectAllEnactingItemsBtn().realHover().click();
    }
}
export default new importOfficeJournalWindow();