class navigationPane {
    elements = {
        editBtn: () => cy.get("*[icon='eui-ecl-edit']"),
        cancelBtn: () => cy.get("*[icon='eui-close']"),
        menuOptions: () => cy.get('div.eui-list-item__container span')
    }
    
    clickEditBtn(){
        this.elements.editBtn().click();
        cy.wait(500);
    }

    clickCancelBtn(){
        this.elements.cancelBtn().click();
    }
}
export default new navigationPane();