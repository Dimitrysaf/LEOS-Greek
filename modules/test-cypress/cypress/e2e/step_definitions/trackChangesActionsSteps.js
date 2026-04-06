import {Then, When} from "@badeball/cypress-cucumber-preprocessor";
import trackChangesActionsPage from "../pages/trackChangesActionsPage";
import ckEditorWindow from "../pages/ckEditorWindow";

When(/^click on reject this change option under track changes action$/, function () {
    trackChangesActionsPage.clickRejectThisChangeBtn();
});

When(/^click on accept this change option under track changes action$/, function () {
    trackChangesActionsPage.clickAcceptThisChangeBtn();
});

Then('click on reject this change context menu option in edition mode', function () {
    ckEditorWindow.getIframeBodyTcPlugin().within(() => {
        trackChangesActionsPage.clickTcRejectThisChangeMenuItem();
    });

});