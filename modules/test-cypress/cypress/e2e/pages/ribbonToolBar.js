class ribbonToolBar {
    elements = {
        ribbonToolBarContainer: () => cy.get('app-ribbon-toolbar-container'),
        ribbonToolBarArrowUpBtn: () => this.elements.ribbonToolBarContainer().find("button.align-self-end eui-icon-svg[icon='chevron-up']"),
        ribbonToolBarArrowDownBtn: () => this.elements.ribbonToolBarContainer().find("button.align-self-end eui-icon-svg[icon='chevron-down']"),
        saveBtn: () => this.elements.ribbonToolBarContainer().contains('Save'),
        exportsBtn: () => this.elements.ribbonToolBarContainer().contains('Exports'),
        displaySection: () => cy.get('#DISPLAY_SECTION_ID'),
        seeUserGuidanceInput: () => this.elements.displaySection().find('app-ribbon-toolbar-checkbox').find('input'),
        showCleanVersionBtn: () => this.elements.displaySection().find('button#DISPLAY_SHOW_CLEAN_VERSION'),
        seeTrackChangesSection: () => cy.get('#SEE-TRACK_CHANGES-ID'),
        enableTrackChangesInput: () => this.elements.seeTrackChangesSection().find('app-ribbon-toolbar-checkbox').eq(0).find('input'),
        enableTrackChangesToggleBtn: () => this.elements.seeTrackChangesSection().find('app-ribbon-toolbar-checkbox').eq(0).find('.eui-slide-toggle__container'),
        seeTrackChangesInput: () => this.elements.seeTrackChangesSection().find('app-ribbon-toolbar-checkbox').eq(1).find('input'),
        seeTrackChangesToggleBtn: () => this.elements.seeTrackChangesSection().find('app-ribbon-toolbar-checkbox').eq(1).find('.eui-slide-toggle__container'),
        markAsDoneBtn: () => cy.get('button#MARK_AS_DONE_ACTION_ID'),
        appZoomScrollBar: () => cy.get('app-zoom-scrollbar'),
        zoomScrollBarInput: () => this.elements.appZoomScrollBar().find('input'),
        zoomInScrollBar: () => this.elements.appZoomScrollBar().find("eui-icon-svg[icon='eui-add']"),
        zoomOutScrollBar: () => this.elements.appZoomScrollBar().find("eui-icon-svg[icon='eui-remove']"),
        importFromOjBtn: () => cy.contains('Import from OJ '),
        changeAnnexStructureBtn: () => cy.get('#STRUCTURE_CHANGE_ANNEX_STRUCTURE_ID'),
        finaliseBtn: () => cy.get('#FINALIZE_ACTION_ID'),
        searchBtn: () => cy.get('#SEARCH_ACTION_ID'),
        documentSearchBar: () => cy.get('app-document-search'),
        searchInputInDocumentSearchBar: () => cy.get('#search-input'),
        searchResults: () => cy.get('div.eui-input-group-addon-item span'),
        focusSearchResult: () => cy.get('.focused-search-result'),
        otherSearchResult: () => cy.get('.search-result'),
        searchControls: () => cy.get('div.search-controls'),
        nextBtnInSearchControl: () => this.elements.searchControls().find("button eui-icon-svg[title='Next']"),
        previousBtnInSearchControl: () => this.elements.searchControls().find("button eui-icon-svg[title='Previous']"),
        cancelBtnInSearchControl: () => this.elements.searchControls().find("button span[translate='global.actions.cancel']"),
        appRibbonToolbarSection: ()=> cy.get('app-ribbon-toolbar-section'),
        compareContainer: ()=> this.elements.appRibbonToolbarSection().find('div#COMPARE_SECTION_ID'),
        comparisonEUILabel: ()=> this.elements.compareContainer().next('div.eui-label'),
        cancelVersionCompareContainer:()=>this.elements.compareContainer().find('button.section-close-icon')
    }

    clickCancelVersionCompareContainer(){
        this.elements.cancelVersionCompareContainer().click();
    }

    clickFinaliseBtn() {
        this.elements.finaliseBtn().click();
    }

    clickEnableTrackChangesToggleBtn() {
        this.elements.enableTrackChangesInput().invoke('show').click({force:true}).wait(500);
    }

    clickChangeAnnexStructureBtn(){
        this.elements.changeAnnexStructureBtn().click();
    }

    clickImportOjButton(){
        this.elements.importFromOjBtn().click();
    }

    clickSeeUserGuidanceToggleBtn(){
        this.elements.seeUserGuidanceInput().invoke('show').click({force:true});
        cy.wait(2000);
    }

    clickSaveBtn() {
        this.elements.saveBtn().click();
    }

    clickRibbonToolBarArrowUpBtn() {
        this.elements.ribbonToolBarArrowUpBtn().click();
    }

    clickRibbonToolBarArrowDownBtn() {
        this.elements.ribbonToolBarArrowDownBtn().click();
    }

    clickZoomInBtn() {
        this.elements.zoomInScrollBar().click();
    }

    clickZoomOutBtn() {
        this.elements.zoomOutScrollBar().click();
    }

    clickSearchBtn() {
        this.elements.searchBtn().click();
    }

    searchInput(keyword) {
        this.elements.searchInputInDocumentSearchBar().type(keyword);
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
export default new ribbonToolBar();