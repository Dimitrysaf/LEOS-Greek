class euiDialogBoxPage {
    elements = {
        dialogHeader: () => cy.get("div[role='dialog'] .eui-dialog__header"),
        deleteBtn: () => cy.get('button.eui-button.eui-button--danger'),
        acceptBtn: () => cy.get('button.eui-dialog__footer-accept-button'),
        dialogBody: () => cy.get('div.eui-dialog__body-content'),
        dialogFooterCloseBtn: () => cy.get('eui-dialog-footer button').contains('Close'),
        headerTitle: () => cy.get("div[role='dialog'] .eui-dialog__header-title"),
        confirmBtn: () => cy.contains('Confirm'),
        input: () => cy.get('input.eui-input-text')
    }
    
    clickDangerButton(){
        this.elements.deleteBtn().click();
        cy.wait(2000);
    }

    clickDeleteBtn(){
        this.elements.acceptBtn().click();
        cy.wait(1000);
    }

    clickAcceptBtn(){
        this.elements.acceptBtn().click();
        cy.wait(2000);
    }

    clickCloseBtn(){
        this.elements.dialogFooterCloseBtn().click();
    }
    
    clickConfirmBtn() {
        this.elements.confirmBtn().click();
    }
}
export default new euiDialogBoxPage();