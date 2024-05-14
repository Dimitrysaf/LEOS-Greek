class loginPage {
    elements = {
        username: () => cy.get('#username'),
        nextBtn: () => cy.get('.btn-primary'),
        password: () => cy.get('#password'),
        signInBtn: () => cy.get('.btn-primary')
    }

    enterUserName(userName) {
        this.elements.username().type(userName);
    }

    enterPassword(password) {
        this.elements.password().type(password, { log: false });
    }

    clickNextBtn() {
        this.elements.nextBtn().click();
    }

    clickSignInBtn() {
        this.elements.signInBtn().click();
    }

    visitUrl(urlType, previousStringUrl) {
        Cypress.session.clearCurrentSessionData();
        cy.visit(previousStringUrl + Cypress.env(urlType));
        cy.wait(1000);
    }
}
export default new loginPage();