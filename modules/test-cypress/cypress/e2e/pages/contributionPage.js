class contributionPage {
    elements = {
        appMergeActions: () => cy.get('app-merge-actions'),
        applyChanges: () => cy.get('button#apply-id')
    }

    getElementInContribution(eltName, eltNumber) {
        return cy.get('.main-container.leos-revision-content  ' + eltName).eq(eltNumber-1);
    }

    getElementInDocument(eltName, eltNumber) {
        return cy.get('.main-container.leos-doc-content ' + eltName).eq(eltNumber-1);
    }

    getMergeActionsMenu(eltName, eltNumber) {
        return this.getElementInContribution(eltName, eltNumber).next('.merge-actions-wrapper').find('.merge-actions-icon');
    }

    getActionInMergeActions(eltName, eltNumber, action) {
        return this.getElementInContribution(eltName, eltNumber).next('.merge-actions-wrapper').find('.merge-actions').find('span[title="' + action + '"]');
    }

    clickMergeActionsMenu(eltName, eltNumber) {
        this.getMergeActionsMenu(eltName, eltNumber).click();
    }

    clickOnActionInMergeActions(eltName, eltNumber, action) {
        this.getActionInMergeActions(eltName, eltNumber, action).click();
    }

    clickMergeAction(mergeAction) {
        this.elements.appMergeActions().find('button[title="' + mergeAction + '"]').click();
    }

    clickApplyChanges() {
        this.elements.applyChanges().click();
        cy.wait(2000);
    }
}
export default new contributionPage();