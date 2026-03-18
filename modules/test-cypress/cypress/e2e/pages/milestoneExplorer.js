class milestoneExplorer {
    elements = {
        exportBtn: () => cy.get('.eui-dialog__body-content button').contains('Export'),
        tabList: () => cy.get("div.eui-dialog__body-content div[role='tablist']"),
        tabItemLabel: () => this.elements.tabList().find('.eui-tab-item__label'),
        tabItemDanger: () => this.elements.tabList().find('.eui-tab-item.eui-tab-item--danger'),
        tabItemSuccess: () => this.elements.tabList().find('.eui-tab-item.eui-tab-item--success'),
        btnContainer: () => cy.get('span.eui-button__container'),
       ActionBtn:()=>cy.get('div.eui-dialog__body-content div button span'),
        ContainerBtn :()=>cy.get('div.eui-dialog__body-content div button'),
    }

    getTabItemDanger(tabName){
        return this.elements.tabItemDanger().contains(tabName);
    }

    getTabItemSuccess(tabName){
        return this.elements.tabItemSuccess().contains(tabName);
    }

    clickTabItemDanger(tabName) {
        this.getTabItemDanger(tabName).click();
    }

    clickTabItemSuccess(tabName) {
        this.getTabItemSuccess(tabName).click();
    }

    getActionBtn(action) {
        return this.elements.btnContainer().contains(action).closest('button');
    }

    clickOnActionBtn(action) {
        this.elements.ActionBtn().contains(action).click();

    }



}
export default new milestoneExplorer();