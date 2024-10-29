import {When} from "cypress-cucumber-preprocessor/steps";
import trackChangesActionsPage from "../pages/trackChangesActionsPage";

When(/^click on reject this change option under track changes action$/, function () {
    trackChangesActionsPage.clickRejectThisChangeBtn();
});