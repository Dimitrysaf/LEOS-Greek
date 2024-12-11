class notificationContainer {
    elements = {
        notificationContainer: () => cy.get('div.notification-container'),
        uploadNotificationBtn: () => cy.get('.notification-container button'),
        bodyComponentPortalId: () => cy.get('#bodyComponentPortalId'),
        uploadNotificationBtnInDialogBox: () => this.elements.bodyComponentPortalId().contains('Upload notification').closest('button'),
        chooseFileInputBtn: () => this.elements.bodyComponentPortalId().find('input'),
        hideBtn: () => cy.get('.notification-container a').contains('Hide'),
        appNotificationCard: () => cy.get('app-notification-card'),
        notificationCardBody: () => this.elements.appNotificationCard().find('.notification-card-body')
    }

    clickUploadNotificationBtn() {
        this.elements.uploadNotificationBtn().click();
    }

    clickHideBtn(){
        this.elements.hideBtn().click();
    }

    uploadFile(location) {
        this.elements.chooseFileInputBtn().invoke('show').selectFile(location);
    }
}
export default new notificationContainer();
