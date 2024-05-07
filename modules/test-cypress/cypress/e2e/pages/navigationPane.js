class navigationPane {
    elements = {
        editBtn: () => cy.get('.eui-icon-edit'),
        cancelBtn: () => cy.get('.eui-icon-times'),
        menuOptions: () => cy.get('div.eui-list-item__container span')
    }
    
    clickEditBtn(){
        this.elements.editBtn().click();
    }

    clickCancelBtn(){
        this.elements.cancelBtn().click();
    }
}
export default new navigationPane();