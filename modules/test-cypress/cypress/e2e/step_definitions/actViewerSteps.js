import { When, And, Then } from "cypress-cucumber-preprocessor/steps";
import actViewerPage from "../pages/actViewerPage";
import headerPage from "../pages/headerPage";

Then('user is on act viewer page', () => {
    headerPage.getCurrentPageName().should("have.text", "Act View");
})

Then('click on legal act link present in act viewer page', () => {
    actViewerPage.clickLegalActLink();
})

When('click on close button on act viewer page', () => {
    actViewerPage.clickCloseBtn();
})

Then(`title of the act contains {string} keyword`, (title) => {
    actViewerPage.elements.proposalTitle().should('include.text',title);
});

When(`click on cover page link present in act viewer page`, () => {
    actViewerPage.clickCoverPageLink();
});

And(`cover page link is present`, () => {
    actViewerPage.elements.coverPageLink().should('be.visible');
});

Then(`explanatory memorandum link is present`, () => {
    actViewerPage.elements.expMemoLink().should('be.visible');
});

Then(`legal act link is present`, () => {
    actViewerPage.elements.legalActLink().should('be.visible');
});

Then(`annexes section is present`, () => {
    actViewerPage.elements.annexesSection().should('be.visible');
});

Then(`there is no annex in annexes section`, () => {
    actViewerPage.elements.noAnnexPresent().should('be.visible');
});

When(`click on add button in annexes section`, () => {
    actViewerPage.clickAddAnnexBtn();
});

Then(`total number of annexes present in act viewer page is {int}`, (count) => {
    actViewerPage.elements.annexCount().should('have.length',count);
});

When(`click on action icon of annex {int}`, (annexNumber) => {
    actViewerPage.clickActionsMenuOfAnnex(annexNumber);
});

When(`click on annex {int} link`, (annexNumber) => {
    actViewerPage.clickNthAnnex(annexNumber);
});

When(`click on change title button`, () => {
    actViewerPage.clickChangeTitleBtn();
});

Then(`title of annex {int} contains {string}`, (annexNumber, title) => {
    actViewerPage.getTitleElementOfAnnex(annexNumber).should('have.text',title);
});

When(`click on delete button in action menu`, () => {
    actViewerPage.clickDeleteBtnFromActionMenu();
});

When(`click on actions button`, () => {
    actViewerPage.clickOnActionButton();
});

And(`click on download button`, () => {
    actViewerPage.clickDownloadButton();
    headerPage.getLoadingIcon().should('not.exist');
});

When(`click on milestones tab in act view page`, () => {
    actViewerPage.clickMilestonesTab();
});

When(`click on explanatory memorandum link present in act viewer page`, function () {
    actViewerPage.clickExpMemoLink();
});

When(`click on add button in financial statement section`, function () {
    actViewerPage.clickAddFinancialStatementBtn();
});

Then(`delete button of financial statement is displayed`, function () {
    actViewerPage.elements.deleteFinancialStatementBtn().should('be.visible');
});

Then(`add button is displayed under financial statement section`, function () {
    actViewerPage.elements.addFinancialStatementBtn().should('be.visible');
});

When(`click on delete button of financial statement`, function () {
    actViewerPage.clickDeleteFinancialStatementBtn();
});

When(`click on financial statement link present in act viewer page`, function () {
    actViewerPage.clickFinancialStatementLink();
});

Then(`label {string} is displayed in act viewer page`, function (label) {
    actViewerPage.checkLabel(label).should('be.visible');
});

Then(`chip content container {int} of act header contains {string}`, function (chipContentContainerNumber, headerValue) {
    actViewerPage.getChipContentContainerElement(chipContentContainerNumber).should('have.text', headerValue);
});

Then(`act header doesn't contains chip content container`, function () {
    actViewerPage.elements.chipContentContainer().should('not.exist');
});

When(`click on drafts tab in act view page`, function () {
    actViewerPage.clickDraftsTab();
});

Then(`active tab name is {string}`, function (tabName) {
    actViewerPage.elements.activeTab().should('have.text', tabName);
});

When(/^click on collaborators tab in act view page$/, function () {
    actViewerPage.clickCollaboratorsTab();
});

When(/^click on details tab in act view page$/, function () {
    actViewerPage.clickDetailsTab();
});

Then(/^template name is "([^"]*)" in details tab$/, function (templateName) {
    actViewerPage.elements.templateLabelValue().should('have.text', templateName);
});

Then(/^language is "([^"]*)" in details tab$/, function (language) {
    actViewerPage.elements.languageLabelValue().should('have.text', language);
});

Then(/^confidentiality level is "([^"]*)" in details tab$/, function (confidentialityLevel) {
    actViewerPage.elements.confidentialityLevelLabelValue().should('have.text', confidentialityLevel);
});

Then(/^EEA Relevance is unticked in details tab$/, function () {
    actViewerPage.elements.eeARelevanceCheckBoxValue().should('not.be.checked');
});