class uploadDocumentPage {
    elements = {
        chooseFileInputBtn: () => cy.get("input[type='file']"),
        documentTitle: () => cy.get('input#docPurpose'),
        activeStepLabel: () => cy.get('div.ux-wizard-step--active .ux-wizard-step__label-wrapper-label'),
        createBtn: () => cy.get('app-proposal-upload-wizard .app-dialog-footer-content button.eui-button.eui-button--primary')
    }

    clickCreateBtn(){
        this.elements.createBtn().click();
    }

    uploadFile(location){
        this.elements.chooseFileInputBtn().invoke('show').selectFile(location);
    }

    enterProposalTitle(title) {
        this.elements.documentTitle().clear().type(title);
    }
}
export default new uploadDocumentPage();