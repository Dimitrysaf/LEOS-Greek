class trackChangesActionsPage {
    elements = {
        trackChangesActions: () => cy.get('app-track-changes-actions'),
        rejectThisChangeBtn: () => this.elements.trackChangesActions().find("button[title='Reject this change']"),
        acceptThisChangeBTn: () => this.elements.trackChangesActions().find("button[title='Accept this change']"),
        tcRejectThisChangeMenu: () => cy.get('a[title="Reject this change"]'),
    }


    clickRejectThisChangeBtn() {
        this.elements.rejectThisChangeBtn().click();
        cy.wait(500);
    }

    clickAcceptThisChangeBtn() {
        this.elements.acceptThisChangeBTn().click();
        cy.wait(500);

    }

    clickTcRejectThisChangeMenuItem() {
        this.elements.tcRejectThisChangeMenu()
            .should('be.visible')
            .click();
    }
}
export default new trackChangesActionsPage();