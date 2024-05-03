class navigationPane {
    elements = {
        editBtn: () => cy.get('.eui-icon-edit'),
        cancelBtn: () => cy.get('.eui-icon-times')
    }
    
    clickEditBtn(){
        this.elements.editBtn().click();
    }

    clickCancelBtn(){
        this.elements.cancelBtn().click();
    }
}
export default new navigationPane();