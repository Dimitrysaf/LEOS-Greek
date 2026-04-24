class contributionPage {
    elements = {
        appMergeActions: () => cy.get('app-merge-actions'),
        applyChanges: () => cy.get('button#apply-id'),
        contributionViewContainer: () => cy.get('#contributionViewContainer '),
        titleMergeActionsMenu: () => cy.get('div container div.Vaadin-Icons.merge-actions-wrapper')
    }

    getElementInContribution(eltName, eltNumber) {
        return cy.get('.main-container.leos-revision-content  ' + eltName).eq(eltNumber-1);
    }

    getElementInDocument(eltName, eltNumber) {
        return cy.get('.main-container.leos-doc-content ' + eltName).eq(eltNumber-1);
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

    ClickTitleMergeActionsMenu(){
        this.elements.titleMergeActionsMenu().click()
    }

    getParagraphOfArticle(paragraphNumber, articleNumber){
        return this.getElementInContribution('article', articleNumber).find('paragraph').eq(paragraphNumber-1);
    }

    getMergeActionsIcon(baseElement) {
        return baseElement
            .next('.merge-actions-wrapper')
            .find('.merge-actions-icon');
    }

    getMergeActionsMenu(eltName, eltNumber) {
        return this.getMergeActionsIcon(
            this.getElementInContribution(eltName, eltNumber)
        );
    }

    getWrapperOfParagraphOfArticle(paragraphNumber, articleNumber) {
        return this.getMergeActionsIcon(
            this.getParagraphOfArticle(paragraphNumber, articleNumber)
        );
    }
}
export default new contributionPage();