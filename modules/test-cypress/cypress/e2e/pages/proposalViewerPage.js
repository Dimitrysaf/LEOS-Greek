import headerPage from './headerPage';

class proposalViewerPage extends headerPage{
    elements = {
        proposalTitle: () => cy.get('app-proposal-header h1'),
        favouriteIconBtn: () => cy.get('eui-icon.eui-icon--size-l'),
        actionBtn: () => cy.contains('Actions'),
        closeBtn: () => cy.contains("Close"),
        legalActLink: () => cy.xpath("//a//*[text()='Legal Act']"),
        coverPageLink: () => cy.xpath("//a//*[text()='Cover Page']"),
        expMemoLink: () => cy.xpath("//a//*[text()='Explanatory Memorandum']"),
        AddBtnfinancialStatement: () => cy.xpath("//div/*[text()='Financial Statement']//ancestor::div[contains(@class,'eui-u-flex')]//button//span[text()=' Add ']"),
        financialStatementLink: () => cy.xpath("//a/*[text()='Financial Statement']"),
        deleteBtnfinancialStatement: () => cy.xpath("//a/*[text()='Financial Statement']//ancestor::div[contains(@class,'eui-u-flex')]//button//span[text()=' Delete ']"),
        activeTab: () => cy.get('div.eui-tab-item--active'),
        draftsTab: () => cy.xpath("//div[@class='eui-tab-item__label' and text()='Drafts']"),
        milestoneTab: () => cy.xpath("//div[@class='eui-tab-item__label' and text()='Milestones']"),
        collaboratorsTab: () => cy.xpath("//div[@class='eui-tab-item__label' and text()='Collaborators']"),
        proposalDetailsTab: () => cy.xpath("//div[@class='eui-tab-item__label' and text()='Details']"),
        AddBtnAnnex: () => cy.xpath("//div/*[text()='Annexes']//ancestor::div[contains(@class,'eui-u-flex')]//button//span[text()=' Add ']"),
        reOrderBtnAnnex: () => cy.xpath("//div/*[text()='Annexes']//ancestor::div[contains(@class,'eui-u-flex')]//button//span[text()=' Reorder ']"),
    }

    clickCloseBtn(){
        this.elements.closeBtn().click();
    }

    clickLegalActLink(){
        this.elements.legalActLink().click();
    }

}
export default new proposalViewerPage();

import '@cypress/xpath';