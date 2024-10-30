class actViewerPage {
    elements = {
        appProposalHeader: () => cy.get('app-proposal-header'),
        proposalTitle: () => this.elements.appProposalHeader().find('h1'),
        actionBtn: () => cy.get('app-proposal-actions-dropdown button'),
        downloadBtn:() => cy.get('.eui-dropdown-item__content-text').contains('Download'),
        deleteBtn: () => cy.get('button.eui-u-color-danger-100'),
        closeBtn: () => cy.contains("Close"),
        legalActLink: () => cy.get('.eui-tab-content-wrapper eui-card').contains('Legal Act'),
        coverPageLink: () => cy.get('.eui-tab-content-wrapper eui-card').contains('Cover Page'),
        expMemoLink: () => cy.get('.eui-tab-content-wrapper eui-card').contains('Explanatory Memorandum'),
        financialStatementLink: () => cy.get('.eui-tab-content-wrapper eui-card').contains('Financial Statement'),
        annexesSection: () => cy.get('.eui-tab-content-wrapper eui-card').contains('Annexes'),
        // AddBtnfinancialStatement: () => cy.xpath("//div/*[text()='Financial Statement']//ancestor::div[contains(@class,'eui-u-flex')]//button//span[text()=' Add ']"),
        // financialStatementLink: () => cy.xpath("//a/*[text()='Financial Statement']"),
        // deleteBtnfinancialStatement: () => cy.xpath("//a/*[text()='Financial Statement']//ancestor::div[contains(@class,'eui-u-flex')]//button//span[text()=' Delete ']"),
        activeTab: () => cy.get('div.eui-tab-item--active'),
        tabItem: () => cy.get('div.eui-tabs__items-wrapper .eui-tab-item'),
        draftsTab: () => this.elements.tabItem().contains('Drafts'),
        detailsTab: () => this.elements.tabItem().contains('Details'),
        milestoneTab: () => this.elements.tabItem().contains('Milestones'),
        collaboratorsTab: () => this.elements.tabItem().contains('Collaborators'),
        // proposalDetailsTab: () => this.elements.tabItem().contains('Details'),
        AddBtnAnnex: () => cy.xpath("//div/*[text()='Annexes']//ancestor::div[contains(@class,'eui-u-flex')]//button//span[text()=' Add ']"),
        addFinancialStatementBtn: () => cy.xpath("//div/*[text()='Financial Statement']//ancestor::div[contains(@class,'eui-u-flex')]//button//span[text()=' Add ']"),
        deleteFinancialStatementBtn: () => cy.xpath("//*[text()='Financial Statement']//ancestor::div[contains(@class,'eui-u-flex')]//button//span[text()=' Delete ']"),
        // reOrderBtnAnnex: () => cy.xpath("//div/*[text()='Annexes']//ancestor::div[contains(@class,'eui-u-flex')]//button//span[text()=' Reorder ']"),
        noAnnexPresent: () => cy.contains("There is no annex to this document"),
        annexCount: () => cy.get('eui-card .eui-card-content table tbody tr'),
        changeTitleBtn: () => cy.xpath("//button[text()='Change title']"),
        deleteBtnFromActionMenu: () => cy.xpath("//button[text()='Delete']"),
        chipContentContainer: () => cy.get('div.eui-chip__content-container'),
        rowLabel: () => cy.get('.row label'),
        templateLabelValue: () => this.elements.rowLabel().contains('Template').closest('div').next('div'),
        languageLabelValue: () => this.elements.rowLabel().contains('Language').closest('div').next('div'),
        confidentialityLevelLabelValue: () => this.elements.rowLabel().contains('Confidentiality Level').closest('div').next('div'),
        eeARelevanceCheckBoxValue: () => this.elements.rowLabel().contains('EEA Relevance').prev('input'),
        favouriteIcon: () => this.elements.appProposalHeader().find("eui-icon-svg svg[class*='eui-bookmark']")
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
        this.elements.annexCount().eq(annexNumber-1).find("button[aria-label='Annex Actions']").find("*[icon='eui-ellipsis-vertical']").scrollIntoView().click();
    }

    clickChangeTitleBtn(){
        this.elements.changeTitleBtn().click();
    }

    getTitleElementOfAnnex(annexNumber){
        return this.elements.annexCount().eq(annexNumber-1).find('a strong');
    }
    
    clickDeleteBtnFromActionMenu(){
        this.elements.deleteBtnFromActionMenu().scrollIntoView().click();
    }

    clickMilestonesTab(){
        this.elements.milestoneTab().click();
    }

    clickDraftsTab(){
        this.elements.draftsTab().click();
    }

    clickExpMemoLink() {
        this.elements.expMemoLink().click();
    }

    clickAddFinancialStatementBtn() {
        this.elements.addFinancialStatementBtn().click();
    }

    clickDeleteFinancialStatementBtn() {
        this.elements.deleteFinancialStatementBtn().click();
    }

    clickFinancialStatementLink() {
        this.elements.financialStatementLink().click();
    }

    checkLabel(label) {
        return cy.contains(label);
    }

    getChipContentContainerElement(chipContentContainerNumber) {
        return this.elements.chipContentContainer().eq(chipContentContainerNumber-1);
    }

    clickCollaboratorsTab() {
        this.elements.collaboratorsTab().click();
    }

    clickDetailsTab() {
        this.elements.detailsTab().click();
    }

    clickFavouriteIcon() {
        this.elements.favouriteIcon().click({force:true});
    }
}
export default new actViewerPage();
import '@cypress/xpath';