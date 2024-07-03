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
        aknbody: () => this.elements.bill().find('aknbody'),
        recitals: () => this.elements.preamble().find('recitals'),
        recital: () => this.elements.recitals().find(' .leos-import-wrapper'),
        article: () => this.elements.aknbody().find('.leos-import-wrapper'),
        importBtn: () => cy.get('.eui-dialog__footer-content button').contains('Import'),
        selectAllRecitalsBtn: () => cy.get(".app-u-gap-s button").eq(0),
        selectAllArticlesBtn: () => cy.get(".app-u-gap-s button").eq(1),
        checkBoxInputRecital: () => this.elements.recital().find('input'),
        checkBoxInputArticle: () => this.elements.article().find('input'),
        checkedRecitals: () => this.elements.recital().find('input:checked'),
        checkedArticles: () => this.elements.article().find('input:checked')
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
        this.elements.article().eq(articleNumber-1).find('input').click();
    }

    clickImportBtn(){
        this.elements.importBtn().click();
        cy.wait(5000);
    }

    clickSelectAllRecitalsBtn(){
        this.elements.selectAllRecitalsBtn().realHover().click();
    }

    clickSelectAllArticlesBtn(){
        this.elements.selectAllArticlesBtn().realHover().click();
    }
}
export default new importOfficeJournalWindow();