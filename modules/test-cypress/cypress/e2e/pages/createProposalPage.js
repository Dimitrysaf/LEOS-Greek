class createProposalPage {
    elements = {
        nextBtn: () => cy.contains('Next'),
        collapseAllBtn: () => cy.get("button[title='Collapse All']"),
        // previousBtn: () => cy.contains('Previous'),
        // cancelBtn: () => cy.contains('Cancel'),
        dialogHeader: () => cy.contains('Create new legislative document'),
        documentTitle: () => cy.get('input#docPurpose'),
        createBtn: () => cy.get('app-proposal-create-wizard .app-dialog-footer-content button.eui-button.eui-button--primary')
    }

    clickTemplateByName(templateName) {
        return cy.xpath("//label[contains(text(),'" + templateName + "')]").click();
    }

    clickNextBtn() {
        this.elements.nextBtn().click();
    }

    enterProposalTitle(title) {
        this.elements.documentTitle().clear().type(title);
    }

    clickCreateBtn() {
        this.elements.createBtn().click();
    }
}
export default new createProposalPage();