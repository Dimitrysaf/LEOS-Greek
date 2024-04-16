class ribbonToolBar {
    elements = {
        saveBtn: () => cy.contains('Save'),
        importFromOjBtn: () => cy.contains('Import from OJ '),
        exportsBtn: () => cy.contains('Exports'),
        searchBtn: () => cy.contains('Search'),
        seeUserGuidanceToggle: () => cy.xpath("//*[text()='See user guidance']//preceding-sibling::eui-slide-toggle//input"),
        enableTrackChangesToggle: () => cy.xpath("//*[text()='Enable track changes']//preceding-sibling::eui-slide-toggle//input"),
        seeTrackChangesToggle: () => cy.xpath("//*[text()='See track changes']//preceding-sibling::eui-slide-toggle//input"),
    }
    
}
export default new ribbonToolBar();