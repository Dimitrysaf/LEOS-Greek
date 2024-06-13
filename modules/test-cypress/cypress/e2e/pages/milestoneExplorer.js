class milestoneExplorer {
    elements = {
        exportBtn: () => cy.get('.eui-dialog__body-content button').contains('Export'),
        tabItemLabel: () => cy.get("div.eui-dialog__body-content div[role='tablist'] .eui-tab-item__label")
    }

    clickExportBtn(){
        this.elements.exportBtn().click();
    }
    
}
export default new milestoneExplorer();