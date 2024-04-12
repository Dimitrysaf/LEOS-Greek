class loginPage {
    visitUrl() {
        cy.viewport(1280, 720);
        cy.visit(Cypress.env('applicationUrl'));
        cy.wait(2000);
    }
}
export default new loginPage();