class euiDialogBoxPage {
    elements = {
        dialogBox: () => cy.get("div[role='dialog']"),
        dialogHeader: () => cy.get("div[role='dialog'] .eui-dialog__header"),
        deleteBtn: () => cy.get('button.eui-button.eui-button--danger'),
        acceptBtn: () => cy.get('button.eui-dialog__footer-accept-button'),
        dialogBody: () => cy.get('div.eui-dialog__body-content'),
        dialogFooterCloseBtn: () => cy.get('eui-dialog-footer button').contains('Close'),
        dialogFooterDismissCloseBtn: () => cy.get('button.eui-dialog__footer-dismiss-button').contains('Close'),
        headerTitle: () => cy.get("div[role='dialog'] .eui-dialog__header-title"),
        confirmBtn: () => cy.get('eui-dialog-footer button').contains('Confirm '),
        cancelBtn: () => cy.get('.app-dialog-footer-content button').contains('Cancel'),
        input: () => cy.get('input.eui-input-text'),
        exampleBox: () => cy.get('div.example-box'),
        exampleBoxNgContent: () => this.elements.exampleBox().find('div')
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

    clickDismissCloseBtn(){
        this.elements.dialogFooterDismissCloseBtn().click();
    }
    
    clickConfirmBtn() {
        this.elements.confirmBtn().click();
    }

    clickCancelBtn() {
        this.elements.cancelBtn().click();
    }
}
export default new euiDialogBoxPage();