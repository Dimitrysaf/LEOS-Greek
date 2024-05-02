class loginPage {
    elements = {
        username: () => cy.get('#username'),
        nextBtn: () => cy.get('.btn-primary'),
        password: () => cy.get('#password'),
        signInBtn: () => cy.get('.btn-primary')
    }

    enterUserName(userName){
       this.elements.username().type(userName);
    }

    enterPassword(password){
        this.elements.password().type(password);
     }

     clickNextBtn(){
        this.elements.nextBtn().click();
        cy.wait(2000);
     }

     clickSignInBtn(){
        this.elements.signInBtn().click();
        cy.wait(10000);
     }
     
    visitUrl(urlType, previousStringUrl) {
        cy.viewport(1280, 720);
        cy.visit(previousStringUrl + Cypress.env(urlType));
        cy.wait(2000);
    }
}
export default new loginPage();