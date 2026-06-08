class createActPage {
    elements = {
        dialogFooterContentButton: () => cy.get('.app-dialog-footer-content button span.eui-label'),
        nextBtn: () => this.elements.dialogFooterContentButton().contains('Next'),
        collapseAllBtn: () => cy.get("button[title='Collapse All']"),
        // previousBtn: () => cy.contains('Previous'),
        // cancelBtn: () => cy.contains('Cancel'),
        dialogHeader: () => cy.contains('Create new legislative document'),
        documentTitle: () => cy.get('input#docPurpose'),
        createBtn: () => cy.get('app-proposal-create-wizard .app-dialog-footer-content button.eui-button.eui-button--primary'),
        eeARelevanceInputCheckBox: () => cy.get("input[formcontrolname='eeaRelevance']"),
        guidanceApprovalCheckbox: () => cy.get("input#guidanceApproval"),
        templateList: () => cy.get('cdk-nested-tree-node label'),
        keepActType:() => cy.get('label.eui-u-mt-none'),
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

    clickEEARelevanceInputCheckBox() {
        this.elements.eeARelevanceInputCheckBox().click();
    }

    clickGuidanceApprovalCheckbox() {
        this.elements.guidanceApprovalCheckbox().click();
    }

    gettypeOfTheAct(typeOfAct) {
        return cy.contains('label', typeOfAct)
            .parent()
            .find('input');

    }
    clickChangeCopyAct(typeOfAct){
        this.elements.keepActType().contains(typeOfAct).click();
    }
}
export default new createActPage();