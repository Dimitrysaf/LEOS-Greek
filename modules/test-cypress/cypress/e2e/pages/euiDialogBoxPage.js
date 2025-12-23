class euiDialogBoxPage {
    elements = {
        dialogBox: () => cy.get("div[role='dialog']"),
        dialogHeader: () => cy.get("div[role='dialog'] .eui-dialog__header"),
        deleteBtn: () => cy.get('eui-dialog-footer button.eui-button.eui-button--danger'),
        acceptBtn: () => cy.get('button.eui-dialog__footer-accept-button'),
        cancelBtn: () => cy.get('button.eui-dialog__footer-dismiss-button'),
        dialogBody: () => cy.get('div.eui-dialog__body-content'),
        dialogFooterCloseBtn: () => cy.get('eui-dialog-footer button').contains('Close'),
        dialogFooterDismissCloseBtn: () => cy.get('button.eui-dialog__footer-dismiss-button').contains('Close'),
        headerTitle: () => cy.get("div[role='dialog'] .eui-dialog__header-title"),
        confirmBtn: () => cy.get('eui-dialog-footer button').contains('Confirm '),
        input: () => cy.get('input.eui-input-text'),
        exampleBox: () => cy.get('div.example-box'),
        exampleBoxNgContent: () => this.elements.exampleBox().find('div'),
        dialogTitle :()=>this.elements.dialogBox().find('div')
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

    clickArchiveBtn(){
        this.elements.acceptBtn().click();
        cy.wait(2000);
    }
}
export default new euiDialogBoxPage();