class dialogBoxPage {
    elements = {
        dialogHeader: () => cy.get("div[role='dialog'] .eui-dialog__header"),
        deleteBtn: () => cy.get('button.eui-button.eui-button--danger'),
        acceptBtn: () => cy.get('button.eui-dialog__footer-accept-button'),
        dialogBody: () => cy.get('div.eui-dialog__body-content'),
        dialogFooterCloseBtn: () => cy.get('eui-dialog-footer button').contains('Close'),
        headerTitle: () => cy.get("div[role='dialog'] .eui-dialog__header-title"),
        input: () => cy.get('input.eui-input-text')
    }
    
    clickOnDangerButton(){
        this.elements.deleteBtn().click();
        cy.wait(2000);
    }

    clickDeleteBtn(){
        this.elements.deleteBtn().click();
    }

    clickAcceptBtn(){
        this.elements.acceptBtn().click();
        cy.wait(2000);
    }

    clickCloseBtn(){
        this.elements.dialogFooterCloseBtn().click();
    }
}
export default new dialogBoxPage();