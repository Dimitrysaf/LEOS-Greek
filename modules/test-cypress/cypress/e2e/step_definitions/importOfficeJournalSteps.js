import { When, Then } from "cypress-cucumber-preprocessor/steps";
import importOfficeJournalWindow from "../pages/importOfficeJournalWindow";

Then(`close button in import office journal window is displayed and enabled`, () => {
    importOfficeJournalWindow.elements.closeBtn().should('be.visible');
    importOfficeJournalWindow.elements.closeBtn().should('not.be.disabled');
});

Then(`{string} option is selected by default for type field`, (option) => {
    importOfficeJournalWindow.elements.typeDropdown().should('have.value', option);
});

Then(`current year is selected by default for year field`, () => {
    importOfficeJournalWindow.elements.yearDropdown().should('have.value', new Date().getFullYear());
});

Then(`blank input box is present for Nr. field`, () => {
    importOfficeJournalWindow.elements.nr().should('have.value', '');
});

When(`click on type field`, () => {
    importOfficeJournalWindow.clickTypeField();
});

When(`below options are displayed in type dropdown`, (datatable) => {
    const giveTypeDropDownOptionList = [];
    datatable.hashes().forEach((typeDropDownOption) => {
        giveTypeDropDownOptionList.push(typeDropDownOption.TypeOptions);
    });
    importOfficeJournalWindow.elements.typeDropDownOption()
        .then(($els) => {
            return (
                Cypress.$.makeArray($els)
                    .map((el) => el.innerText.trim())
            )
        })
        .should('deep.equal', giveTypeDropDownOptionList);
});

When(`click on search button in import office journal window`, () => {
    importOfficeJournalWindow.clickSearchBtn();
});

Then(`exclamation mark is appeared with {string} color`, (color) => {
    importOfficeJournalWindow.elements.exclamationMark().should('have.css', 'color', color);
});

When(`select option {string} for type field`, (option) => {
    importOfficeJournalWindow.selectFromTypeFieldByVisibleText(option);
});

When(`select option {string} for year field`, (option) => {
    importOfficeJournalWindow.selectFromYearFieldByVisibleText(option);
});

When(`provide value {string} in Nr. field`, (value) => {
    importOfficeJournalWindow.typeNrField(value);
});

Then(`bill content is appeared in import office journal window`, () => {
    importOfficeJournalWindow.elements.importContent().should('exist');
});

When(`click on checkbox of recital {int}`, (recitalNumber) => {
    importOfficeJournalWindow.clickRecitalCheckBox(recitalNumber);
});

When(`click on checkbox of article {int}`, (articleNumber) => {
    importOfficeJournalWindow.clickArticleCheckBox(articleNumber);
});

When(`click on import button`, () => {
    importOfficeJournalWindow.clickImportBtn();
});

When(`click on select all recitals button in import office journal window`, () => {
    importOfficeJournalWindow.clickSelectAllRecitalsBtn();
});

When(`click on select all enacting items button in import office journal window`, () => {
    importOfficeJournalWindow.clickSelectAllEnactingItemsBtn();
});

Then(`checkboxes of all the recitals are selected`, () => {
    importOfficeJournalWindow.elements.checkBoxInputRecital().should('be.checked');
});

Then(`checkboxes of all the articles are selected`, () => {
    importOfficeJournalWindow.elements.checkBoxInputArticle().should('be.checked');
});

Then(`number of recitals selected is {int}`, (recitalNumber) => {
    importOfficeJournalWindow.elements.checkedRecitals().should('have.length', recitalNumber);
});

Then(`number of articles selected is {int}`, (articleNumber) => {
    importOfficeJournalWindow.elements.checkedArticles().should('have.length', articleNumber);
});

Then(/^checkboxes of all the parts are selected$/, function () {
    importOfficeJournalWindow.elements.checkBoxInputPart().should('be.checked');
});

Then(/^number of parts selected is (\d+)$/, function (partNumber) {
    importOfficeJournalWindow.elements.checkedParts().should('have.length', partNumber);
});

Then(/^checkboxes of all the titles are selected$/, function () {
    importOfficeJournalWindow.elements.checkBoxInputTitle().should('be.checked');
});

Then(/^number of titles selected is (\d+)$/, function (titleNumber) {
    importOfficeJournalWindow.elements.checkedTitles().should('have.length', titleNumber);
});

Then(/^checkboxes of all the chapters are selected$/, function () {
    importOfficeJournalWindow.elements.checkBoxInputChapter().should('be.checked');
});

Then(/^number of chapters selected is (\d+)$/, function (chapterNumber) {
    importOfficeJournalWindow.elements.checkedChapters().should('have.length', chapterNumber);
});

Then(/^checkboxes of all the sections are selected$/, function () {
    importOfficeJournalWindow.elements.checkBoxInputSection().should('be.checked');
});

Then(/^number of sections selected is (\d+)$/, function (sectionNumber) {
    importOfficeJournalWindow.elements.checkedSections().should('have.length', sectionNumber);
});

Then(/^select all recitals button is disabled$/, function () {
    importOfficeJournalWindow.elements.selectAllRecitalsBtn().should('be.disabled');
});

Then(/^select all enacting items button is disabled$/, function () {
    importOfficeJournalWindow.elements.selectAllEnactingItemsBtn().should('be.disabled');
});

Then(/^select all recitals button is enabled$/, function () {
    importOfficeJournalWindow.elements.selectAllRecitalsBtn().should('not.be.disabled');
});
Then(/^select all enacting items button is enabled$/, function () {
    importOfficeJournalWindow.elements.selectAllEnactingItemsBtn().should('not.be.disabled');
});

When('click on checkbox of higher division part {int}',function(partNumber){
    importOfficeJournalWindow.clickPartCheckBox(partNumber);
})