class createProposalPage {
    elements = {
        nextBtn: () => cy.contains('Next'),
        previousBtn: () => cy.contains('Previous'),
        cancelBtn: () => cy.contains('Cancel'),
        dialogHeader: () => cy.contains('Create new legislative document'),
        documentTitle: () => cy.get('input#docPurpose'),
        createBtn: () => cy.get('app-proposal-create-wizard button.eui-button.eui-button--primary')
    }

    getTemplateElementByName(templateName) {
        return cy.xpath("//span[contains(text(),'" + templateName + "')]");
    }

}
export default new createProposalPage();