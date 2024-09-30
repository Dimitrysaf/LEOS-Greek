class notificationContainer {
    elements = {
        notificationContainer: () => cy.get('div.notification-container'),
        uploadNotificationBtn: () => cy.get('.notification-container button'),
        uploadNotificationBtnInDialogBox: () => cy.get('#bodyComponentPortalId').contains('Upload notification').closest('button'),
        hideBtn: () => cy.get('.notification-container a').contains('Hide'),
        appNotificationCard: () => cy.get('app-notification-card')
    }

    clickUploadNotificationBtn() {
        this.elements.uploadNotificationBtn().click();
    }

    clickHideBtn(){
        this.elements.hideBtn().click();
    }

}
export default new notificationContainer();
