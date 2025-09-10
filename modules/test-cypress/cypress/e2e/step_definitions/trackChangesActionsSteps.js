import {When} from "@badeball/cypress-cucumber-preprocessor";
import trackChangesActionsPage from "../pages/trackChangesActionsPage";

When(/^click on reject this change option under track changes action$/, function () {
    trackChangesActionsPage.clickRejectThisChangeBtn();
});

When(/^click on accept this change option under track changes action$/, function () {
    trackChangesActionsPage.clickAcceptThisChangeBtn();
});