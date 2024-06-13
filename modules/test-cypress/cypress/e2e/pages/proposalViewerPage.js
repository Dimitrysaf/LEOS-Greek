import headerPage from './headerPage';

class proposalViewerPage extends headerPage{
    elements = {
        proposalTitle: () => cy.get('app-proposal-header h1'),
        favouriteIconBtn: () => cy.get('eui-icon.eui-icon--size-l'),
        actionBtn: () => cy.get('app-proposal-actions-dropdown button'),
        downloadBtn:() => cy.get('.eui-dropdown-content button').contains('Download'),
        deleteBtn: () => cy.get('button.eui-list-item--danger'),
        closeBtn: () => cy.contains("Close"),
        legalActLink: () => cy.get('.eui-tab-content-wrapper eui-card').contains('Legal Act'),
        coverPageLink: () => cy.get('.eui-tab-content-wrapper eui-card').contains('Cover Page'),
        expMemoLink: () => cy.get('.eui-tab-content-wrapper eui-card').contains('Explanatory Memorandum'),
        annexesSection: () => cy.get('.eui-tab-content-wrapper eui-card').contains('Annexes'),
        AddBtnfinancialStatement: () => cy.xpath("//div/*[text()='Financial Statement']//ancestor::div[contains(@class,'eui-u-flex')]//button//span[text()=' Add ']"),
        financialStatementLink: () => cy.xpath("//a/*[text()='Financial Statement']"),
        deleteBtnfinancialStatement: () => cy.xpath("//a/*[text()='Financial Statement']//ancestor::div[contains(@class,'eui-u-flex')]//button//span[text()=' Delete ']"),
        activeTab: () => cy.get('div.eui-tab-item--active'),
        draftsTab: () => cy.get('div.eui-tabs__items-wrapper .eui-tab-item').contains('Drafts'),
        milestoneTab: () => cy.get('div.eui-tabs__items-wrapper .eui-tab-item').contains('Milestones'),
        collaboratorsTab: () => cy.get('div.eui-tabs__items-wrapper .eui-tab-item').contains('Collaborators'),
        proposalDetailsTab: () => cy.get('div.eui-tabs__items-wrapper .eui-tab-item').contains('Details'),
        AddBtnAnnex: () => cy.xpath("//div/*[text()='Annexes']//ancestor::div[contains(@class,'eui-u-flex')]//button//span[text()=' Add ']"),
        reOrderBtnAnnex: () => cy.xpath("//div/*[text()='Annexes']//ancestor::div[contains(@class,'eui-u-flex')]//button//span[text()=' Reorder ']"),
        noAnnexPresent: () => cy.contains("There is no annex to this document"),
        annexCount: () => cy.get('eui-card .eui-card-content table tbody tr'),
        changeTitleBtn: () => cy.get("button[translate$='actions.dropdown.edit-title']"),
        deleteBtnFromActionMenu: () => cy.get("button[translate='global.actions.delete']")
    }

    clickCloseBtn(){
        this.elements.closeBtn().click();
    }

    clickLegalActLink(){
        this.elements.legalActLink().click();
    }

    clickOnActionButton(){
        this.elements.actionBtn().click();
    }

    clickDownloadButton(){
        this.elements.downloadBtn().click();
        cy.wait(5000);
    }

    clickOnDeleteButton(){
        this.elements.deleteBtn().click();
    }

    clickCoverPageLink(){
        this.elements.coverPageLink().click();
    }

    clickAddAnnexBtn(){
        this.elements.AddBtnAnnex().click();
    }

    clickNthAnnex(annexNumber){
        this.elements.annexCount().eq(annexNumber-1).find('a').click();
    }

    clickActionsMenuOfAnnex(annexNumber){
        this.elements.annexCount().eq(annexNumber-1).find("button[aria-label='Annex Actions'] .eui-icon-more-vertical").trigger('mouseover').click();
    }

    clickChangeTitleBtn(){
        this.elements.changeTitleBtn().click();
    }

    getTitleElementOfAnnex(annexNumber){
        return this.elements.annexCount().eq(annexNumber-1).find('a strong');
    }
    
    clickDeleteBtnFromActionMenu(){
        this.elements.deleteBtnFromActionMenu().click();
    }

    clickMilestonesTab(){
        this.elements.milestoneTab().click();
    }
}
export default new proposalViewerPage();

import '@cypress/xpath';