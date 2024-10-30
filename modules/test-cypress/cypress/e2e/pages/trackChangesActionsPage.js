class trackChangesActionsPage {
    elements = {
        trackChangesActions: () => cy.get('app-track-changes-actions'),
        rejectThisChangeBtn: () => this.elements.trackChangesActions().find("button[title='Reject this change']")
    }

    clickRejectThisChangeBtn() {
        this.elements.rejectThisChangeBtn().click();
    }
}
export default new trackChangesActionsPage();