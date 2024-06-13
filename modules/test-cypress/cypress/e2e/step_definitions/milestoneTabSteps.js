import { Before, Given, When, And, Then } from "cypress-cucumber-preprocessor/steps";
import milestoneTab from "../pages/milestoneTab";
import dialogBoxPage from "../pages/dialogBoxPage";

When(`click on add button in milestones tab`, () => {
    milestoneTab.clickAddBtn();
});

Then(`add milestone window is displayed`, () => {
    dialogBoxPage.elements.dialogHeader().should('include.text','Add milestone');
});

When(`click on milestone type dropdown`, () => {
    milestoneTab.elements.milestoneTypeDropDown();
});

And(`{string} option is selected by default`, (option) => {
    milestoneTab.elements.milestoneTypeDropDown().should('have.value', option);
});

And(`milestone title textbox is disabled`, () => {
    milestoneTab.elements.milestoneTitleTextBox().should('be.disabled');
});

When(`click on option {string} from milestone type dropdown`, (option) => {
    milestoneTab.selectByVisibleText(option);
});

Then(`milestone title textbox is enabled`, () => {
    milestoneTab.elements.milestoneTitleTextBox().should('not.be.disabled');
});

When(`type {string} in milestone title textbox`, (title) => {
    milestoneTab.typeMilestoneTitle(title);
});

When(`click on create milestone button`, () => {
    milestoneTab.clickCreateMilestoneBtn();
});

Then(`{string} is showing under title column of row {int} of milestones table`, (title, rowNumber) => {
    milestoneTab.getCellFromMilestoneTableBody(rowNumber,2).should('include.text', title);
});

Then(`{string} is showing under status column of row {int} of milestones table`, (status, rowNumber) => {
    milestoneTab.getCellFromMilestoneTableBody(rowNumber,4).should('include.text', status);
});

When(`click on three dots under actions column of row {int} of milestones table`, (rowNumber) => {
    milestoneTab.clickThreeDotsFromActionMenu(rowNumber,5);
});

Then(`below options are displayed under milestone actions`, (datatable) => {
    const givenMilestoneActionMenuOptionList = [];
    datatable.hashes().forEach((milestoneActionMenuOption) => {
        givenMilestoneActionMenuOptionList.push(milestoneActionMenuOption.MilestoneActions);
    });
    milestoneTab.elements.milestoneActionMenuOptions()
        .then(($els) => {
            return (
                Cypress.$.makeArray($els)
                    .map((el) => el.innerText.trim())
            )
        })
        .should('deep.equal', givenMilestoneActionMenuOptionList);
});

When(`click on option {string} under milestone actions`, (option) => {
    milestoneTab.clickMilestoneActionMenu(option);
});