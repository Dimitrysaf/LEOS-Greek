class merge {
    elements = {
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
        cy.get('app-merge-actions').find('button[title="' + mergeAction + '"]').click();
    }

    clickApplyChanges() {
        cy.get('button#apply-id').click();
        cy.wait(2000);
    }
}
export default new merge();