class ribbonToolBar {
    elements = {
        ribbonToolBarContainer: () => cy.get('app-ribbon-toolbar-container'),
        saveBtn: () => this.elements.ribbonToolBarContainer().contains('Save'),
        exportsBtn: () => this.elements.ribbonToolBarContainer().contains('Exports'),
        searchBtn: () => this.elements.ribbonToolBarContainer().contains('Search'),
        displaySection: () => cy.get('#DISPLAY_SECTION_ID'),
        seeUserGuidanceInput: () => this.elements.displaySection().find('app-ribbon-toolbar-checkbox').find('input'),
        showCleanVersionBtn: () => this.elements.displaySection().find('button#DISPLAY_SHOW_CLEAN_VERSION'),
        seeTrackChangesSection: () => cy.get('#SEE-TRACK_CHANGES-ID'),
        enableTrackChangesInput: () => this.elements.seeTrackChangesSection().find('app-ribbon-toolbar-checkbox').eq(0).find('input'),
        enableTrackChangesToggleBtn: () => this.elements.seeTrackChangesSection().find('app-ribbon-toolbar-checkbox').eq(0).find('.eui-slide-toggle__container'),
        seeTrackChangesInput: () => this.elements.seeTrackChangesSection().find('app-ribbon-toolbar-checkbox').eq(1).find('input'),
        seeTrackChangesToggleBtn: () => this.elements.seeTrackChangesSection().find('app-ribbon-toolbar-checkbox').eq(1).find('.eui-slide-toggle__container'),
        zoomValue: () => cy.get('span.zoom-value'),
        importFromOjBtn: () => cy.contains('Import from OJ '),
        changeAnnexStructureBtn: () => cy.get('#STRUCTURE_CHANGE_ANNEX_STRUCTURE_ID')
    }

    clickEnableTrackChangesToggleBtn() {
        this.elements.enableTrackChangesInput().invoke('show').click({force:true})
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

}
export default new ribbonToolBar();