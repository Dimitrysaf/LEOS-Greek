import { When, Then } from "cypress-cucumber-preprocessor/steps";
require('@cypress/xpath');
import notificationContainer from "../pages/notificationContainer";

Then(/^notification container is displayed$/, function () {
    notificationContainer.elements.notificationContainer().should('be.visible');
});

Then(/^upload notification button is displayed$/, function () {
    notificationContainer.elements.uploadNotificationBtn().should('be.visible');
});

When(/^click on upload notification button$/, function () {
    notificationContainer.clickUploadNotificationBtn();
});

Then(/^upload notification button is disabled in upload notifications window$/, function () {
    notificationContainer.elements.uploadNotificationBtnInDialogBox().should('have.attr','disabled');
});

Then(/^notification container is not displayed$/, function () {
    notificationContainer.elements.notificationContainer().should('not.exist');
});

When(/^click on hide button in notification container$/, function () {
    notificationContainer.clickHideBtn();
});

Then(/^upload notification button is not displayed$/, function () {
    notificationContainer.elements.uploadNotificationBtn().should("not.exist");
});

Then(/^notification card list is displayed$/, function () {
    notificationContainer.elements.appNotificationCard().should('be.visible');
});