class actViewerPage {
    elements = {
        appProposalHeader: () => cy.get('app-proposal-header'),
        proposalTitle: () => this.elements.appProposalHeader().find('h1'),
        actionBtn: () => cy.get('app-proposal-actions-dropdown button'),
        downloadBtn:() => cy.get('.eui-dropdown-item__content-text').contains('Download'),
        exportPdfBtn:() => cy.get('.eui-dropdown-item__content-text').contains('Export as PDF'),
        exportLegBtn:() => cy.get('.eui-dropdown-item__content-text').contains('Export as Legiswrite'),
        deleteBtn: () => cy.get('button.eui-u-color-danger-100'),
        closeBtn: () => cy.contains("Close"),
        legalActLink: () => cy.get('.eui-tab-content-wrapper eui-card').contains('Legal Act'),
        coverPageLink: () => cy.get('.eui-tab-content-wrapper eui-card').contains('Cover Page'),
        expMemoLink: () => cy.get('.eui-tab-content-wrapper eui-card').contains('Explanatory Memorandum'),
        financialStatementLink: () => cy.get('.eui-tab-content-wrapper eui-card').contains('Legislative Financial and Digital Statement'),
     //sapna   annexesSection: () => cy.get('.eui-tab-content-wrapper eui-card').contains('Annexes'),
        annexesSection: () => cy.get('div.eui-u-flex-grow > div > strong').contains('Annexes'),
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
        countOfRows:()=>cy.xpath("//table/tbody/tr"),
        reorderButon:()=>cy.xpath("//div/*[text()='Annexes']//ancestor::div[contains(@class,'eui-u-flex')]//button/span[text()=' Reorder ']"),
        //editDialogbox:()=>cy.xpath("//div/h5[@id='headerTitle']"),
        editDialogueCloseButton:()=>cy.xpath("//button/span[text()=' Close ']"),
        addFinancialStatementBtn: () => cy.xpath("//div/*[text()='Financial Statement']//ancestor::div[contains(@class,'eui-u-flex')]//button//span[text()=' Add ']"),
        deleteFinancialStatementBtn: () => cy.xpath("//*[text()='Financial Statement']//ancestor::div[contains(@class,'eui-u-flex')]//button//span[text()=' Delete ']"),
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
        favouriteIcon: () => this.elements.appProposalHeader().find("eui-icon-svg svg[class*='eui-bookmark']"),
        changeTitle:()=>cy.xpath("//div/button[contains(text(), 'Change title')]"),
        editTitleAnnexDialogue:()=>cy.xpath("//div[@id='dialogContent']//h5"),
        changeTitleName :()=>cy.xpath("//div[@id='bodyTemplatePortalId']//input"),
        saveFromEditTitleDialogue:()=>cy.xpath("//button/span[text()=' Save ' ]"),
        clearAnnexPreviousTitle:()=>cy.xpath( "//div[@id='bodyTemplatePortalId']//input"),
        deleteAnnexFromActView:()=>cy.xpath("//eui-dropdown-content//button[text()='Delete']"),
        deleteAnnexButton:()=>cy.xpath("//button/span[text()=' Delete ']"),
        deleteFromDeleteDialogueBox:()=>cy.xpath("//div/eui-dialog-header/h3"),
        editAnnexOrderDialogue:()=>cy.xpath("//h5[@id='headerTitle']"),
        closeButtonFromEditAnnexOrder :()=>cy.xpath("//div/button/span[text()=' Close ']"),

        }
    clickDeleteFromActView(){
        this.elements.deleteAnnexFromActView().click();
    }

    closeButtonFromEditAnnexOrder(){
        this.elements.closeButtonFromEditAnnexOrder().click();
    }

    dragAndDrop(){
        cy.xpath("//div[contains(@id, 'cdk-drop-list-')]//div[text()=' Annex ']")
            .should('exist')
            .trigger('dragstart'); // Start the drag operation

        cy.xpath("//div[contains(@id, 'cdk-drop-list-')]//div[text()=' Annex1 ']")
            .should('exist')
            .trigger('dragenter') // Enter the drop target
            .trigger('dragover')  // Hover over the drop target
            .trigger('drop');     // Perform the drop

    }

   AnnexDeletion(){
    this.elements.deleteAnnexButton().click()
   }

    clearAnnexPreviousTitle(){
        this.elements.clearAnnexPreviousTitle().clear()
    }

    clickSaveFromEditTitleDialogue(){
        this.elements.saveFromEditTitleDialogue().click();
    }

    clickChangeTitle(){
        this.elements.changeTitle().click();
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

    clickReorderButton(){
        this.elements.reorderButon().click();
    }

    countOfAnnexRows (){
        this.elements.countOfRows()
    }

    editDialogueBOX(){
        this.elements.editDialogbox();
    }

    editDialogueCloseButton(){
        this.elements.editDialogueCloseButton().click()
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

    lastElementOfTheAnnexRow(){
        cy.xpath("//tbody/tr/td[4]").last().click()

    }
}
export default new actViewerPage();
import '@cypress/xpath';