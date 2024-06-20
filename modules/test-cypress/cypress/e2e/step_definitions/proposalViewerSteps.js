import { When, And, Then } from "cypress-cucumber-preprocessor/steps";
import proposalViewerPage from "../pages/proposalViewerPage";

Then('user is on proposal viewer page', () => {
    proposalViewerPage.getCurrentPageName().should("have.text", "Proposal View");
})

Then('click on legal act link present in proposal viewer page', () => {
    proposalViewerPage.clickLegalActLink();
})

When('click on close button on proposal viewer page', () => {
    proposalViewerPage.clickCloseBtn();
})

Then(`title of the proposal contains {string} keyword`, (title) => {
    proposalViewerPage.elements.proposalTitle().should('include.text',title);
});

When(`click on cover page link present in proposal viewer page`, () => {
    proposalViewerPage.clickCoverPageLink();
});

And(`cover page link is present`, () => {
    proposalViewerPage.elements.coverPageLink().should('be.visible');
});

Then(`explanatory memorandum link is present`, () => {
    proposalViewerPage.elements.expMemoLink().should('be.visible');
});

Then(`legal act link is present`, () => {
    proposalViewerPage.elements.legalActLink().should('be.visible');
});

Then(`annexes section is present`, () => {
    proposalViewerPage.elements.annexesSection().should('be.visible');
});

Then(`there is no annex in annexes section`, () => {
    proposalViewerPage.elements.noAnnexPresent().should('be.visible');
});

When(`click on add button in annexes section`, () => {
    proposalViewerPage.clickAddAnnexBtn();
});

Then(`total number of annexes present in proposal viewer page is {int}`, (count) => {
    proposalViewerPage.elements.annexCount().should('have.length',count);
});

When(`click on action icon of annex {int}`, (annexNumber) => {
    proposalViewerPage.clickActionsMenuOfAnnex(annexNumber);
});

When(`click on annex {int} link`, (annexNumber) => {
    proposalViewerPage.clickNthAnnex(annexNumber);
});

When(`click on change title button`, () => {
    proposalViewerPage.clickChangeTitleBtn();
});

Then(`title of annex {int} contains {string}`, (annexNumber, title) => {
    proposalViewerPage.getTitleElementOfAnnex(annexNumber).should('have.text',title);
});

When(`click on delete button in action menu`, () => {
    proposalViewerPage.clickDeleteBtnFromActionMenu();
});

When(`click on actions button`, () => {
    proposalViewerPage.clickOnActionButton();
});

And(`click on download button`, () => {
    proposalViewerPage.clickDownloadButton();
    proposalViewerPage.getLoadingIcon().should('not.exist');
});

When(`click on milestones tab in proposal view page`, () => {
    proposalViewerPage.clickMilestonesTab();
});

When(`click on explanatory memorandum link present in proposal viewer page`, function () {
    proposalViewerPage.clickExpMemoLink();
});

When(`click on add button in financial statement section`, function () {
    proposalViewerPage.clickAddFinancialStatementBtn();
});

Then(`delete button of financial statement is displayed`, function () {
    proposalViewerPage.elements.deleteFinancialStatementBtn().should('be.visible');
});

Then(`add button is displayed under financial statement section`, function () {
    proposalViewerPage.elements.addFinancialStatementBtn().should('be.visible');
});

When(`click on delete button of financial statement`, function () {
    proposalViewerPage.clickDeleteFinancialStatementBtn();
});

When(`click on financial statement link present in proposal viewer page`, function () {
    proposalViewerPage.clickFinancialStatementLink();
});

Then(`label {string} is displayed in proposal viewer page`, function (label) {
    proposalViewerPage.checkLabel(label).should('be.visible');
});

Then(`chip content container {int} of proposal header contains {string}`, function (chipContentContainerNumber, headerValue) {
    proposalViewerPage.getChipContentContainerElement(chipContentContainerNumber).should('have.text', headerValue);
});

Then(`proposal header doesn't contains chip content container`, function () {
    proposalViewerPage.elements.chipContentContainer().should('not.exist');
});

When(`click on drafts tab in proposal view page`, function () {
    proposalViewerPage.clickDraftsTab();
});

Then(`active tab name is {string}`, function (tabName) {
    proposalViewerPage.elements.activeTab().should('have.text', tabName);
});