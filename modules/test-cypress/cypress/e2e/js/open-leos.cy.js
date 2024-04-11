describe('open leos', () => {
    it('leos login in dev', () => {
        cy.visit('https://intragate.development.ec.europa.eu/decide-drafting/ui/workspace');
        cy.wait(5000);
        cy.get('#username').type('n00015oj');
        cy.get('.btn-primary').click();
        cy.wait(5000);
        cy.get('#password').type('Sweden1234');
        cy.get('.btn-primary').click();
        cy.wait(12000);
        cy.get('.eui-user-profile__infos-name').invoke('text').should('contain', 'Test1 Test');
    })
})