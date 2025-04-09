class documentSearchBar {
    elements = {
        documentSearchBar: () => cy.get('app-document-search'),
        searchInputInDocumentSearchBar: () => cy.get('#search-input'),
        searchResults: () => cy.get('div.eui-input-group-addon-item span'),
        focusSearchResult: () => cy.get('.focused-search-result'),
        otherSearchResult: () => cy.get('.search-result'),
        searchControls: () => cy.get('div.search-controls'),
        nextBtnInSearchControl: () => this.elements.searchControls().find("button eui-icon-svg[title='Next']"),
        previousBtnInSearchControl: () => this.elements.searchControls().find("button eui-icon-svg[title='Previous']"),
        cancelBtnInSearchControl: () => this.elements.searchControls().find("button span[translate='global.actions.cancel']"),
        replaceBtnFromSearchBar: () => cy.get('eui-icon-svg[title="Replace"]').closest('button'),
        replaceInputInDocumentSearchBar: () => cy.get('#replace-input'),
        replaceAllButton:()=>cy.get("button > span").contains("Replace All"),
        saveAndCloseBtn:()=>cy.get("button > span").contains("Save and close")
    }

    searchInput(keyword) {
        this.elements.searchInputInDocumentSearchBar().clear().type(keyword);
    }

    clickCancelBtnInSearchControl() {
        this.elements.cancelBtnInSearchControl().click();
    }

    clickNextBtnInSearchControl() {
        this.elements.nextBtnInSearchControl().click();
    }

    clickPreviousBtnInSearchControl() {
        this.elements.previousBtnInSearchControl().click();
    }

}
export default new documentSearchBar();