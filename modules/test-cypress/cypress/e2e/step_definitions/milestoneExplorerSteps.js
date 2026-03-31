import { When, Then } from "@badeball/cypress-cucumber-preprocessor";
import dialogBoxPage from "../pages/euiDialogBoxPage";
import milestoneExplorer from "../pages/milestoneExplorer";

Then(`user is on milestone explorer window`, () => {
    dialogBoxPage.elements.dialogHeader().should('have.text', 'Milestone Explorer');
});

When(`click on close button in milestone explorer view`, () => {
    dialogBoxPage.clickCloseBtn();
});

Then(`milestone explorer window contains below tabs`, (datatable) => {
    const givenTabNameList = [];
    datatable.hashes().forEach((milestoneTabList) => {
        givenTabNameList.push(milestoneTabList.TabName);
    });
    milestoneExplorer.elements.tabItemLabel()
        .then(($els) => {
            return (
                Cypress.$.makeArray($els)
                    .map((el) => el.childNodes[0].textContent.trim())
            )
        })
        .should('deep.equal', givenTabNameList);
});

When(/^export button is displayed in milestone explorer window$/, function () {
    milestoneExplorer.elements.exportBtn().should('be.visible');
});

Then(/^"([^"]*)" tab is showing in red color in milestone explorer window$/, function (tabName) {
    milestoneExplorer.getTabItemDanger(tabName).should('be.visible');
});

Then(/^"([^"]*)" tab is showing in green color in milestone explorer window$/, function (tabName) {
    milestoneExplorer.getTabItemSuccess(tabName).should('be.visible');
});

When(/^click on tab "([^"]*)" showing in red color$/, function (tabName) {
    milestoneExplorer.clickTabItemDanger(tabName);
});

When(/^click on tab "([^"]*)" showing in green color$/, function (tabName) {
    milestoneExplorer.clickTabItemSuccess(tabName)
});

Then(/^"([^"]*)" button is enabled in milestone explorer window$/, function (action) {
    milestoneExplorer.getActionBtn(action).should('not.have.attr', 'disabled');
});

Then(/^"([^"]*)" button is disabled in milestone explorer window$/, function (action) {
    milestoneExplorer.elements.ContainerBtn(action).should('have.attr', 'disabled');
});

When('click on {string} button in milestone explorer window', (action) => {
    milestoneExplorer.clickOnActionBtn(action);
});
