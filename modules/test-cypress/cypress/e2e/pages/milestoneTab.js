class milestoneTab {
    elements = {
        addBtn: () => cy.get('app-proposal-milestones button').contains('Add'),
        milestoneTypeDropDown: () => cy.get('#milestone_type'),
        milestoneTitleTextBox: () => cy.get('#milestonesTitle'),
        createMilestoneBtn: () => cy.get('button.eui-button--primary').contains('Create Milestone'),
        milestoneTableBody: () => cy.get('app-proposal-milestones table tbody'),
        milestoneActionMenuOptions: () => cy.get('div.eui-dropdown__panel eui-dropdown-content button'),
        sendForContributionBtn: () => cy.contains('Send for contribution'),
        userList: () => cy.get("div[role='listbox'] eui-autocomplete-option")
    }

    clickAddBtn(){
        this.elements.addBtn().click();
    }

    selectByVisibleText(option){
        this.elements.milestoneTypeDropDown().trigger('click').select(option);
    }

    typeMilestoneTitle(title){
        this.elements.milestoneTitleTextBox().type(title);
    }

    clickCreateMilestoneBtn(){
        this.elements.createMilestoneBtn().click();
    }

    getCellFromMilestoneTableBody(rowNumber,columnNumber){
       return this.elements.milestoneTableBody().children('tr').eq(rowNumber-1).children('td').eq(columnNumber-1);
    }

    clickThreeDotsFromActionMenu(rowNumber,columnNumber){
        this.getCellFromMilestoneTableBody(rowNumber,columnNumber).find("button *[icon='eui-ellipsis-vertical']").click();
    }

    clickMilestoneActionMenu(option){
        this.elements.milestoneActionMenuOptions().contains(option).click();
    }

    clickSendForContributionBtn() {
        this.elements.sendForContributionBtn().click();
    }

    clickUser(index) {
        this.elements.userList().eq(index-1).click();
    }
}
export default new milestoneTab();