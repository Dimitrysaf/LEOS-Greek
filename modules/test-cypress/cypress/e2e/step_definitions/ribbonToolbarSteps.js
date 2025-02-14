import {When, Then, And} from "cypress-cucumber-preprocessor/steps";
import ribbonToolbar from "../pages/ribbonToolBar";

When(`click on finalise button in ribbon toolbar`, () => {
    ribbonToolbar.clickFinaliseBtn();
})

When(`click on change annex structure in ribbon toolbar`, () => {
    ribbonToolbar.clickChangeAnnexStructureBtn();
});

When(`click on import from oj button in ribbon toolbar`, () => {
    ribbonToolbar.clickImportOjButton();
});

Then(`save button is displayed in ribbon toolbar`, function () {
    ribbonToolbar.elements.saveBtn().should('be.visible');
});

Then(`exports button is displayed in ribbon toolbar`, function () {
    ribbonToolbar.elements.exportsBtn().should('be.visible');
});

Then(`search button is displayed in ribbon toolbar`, function () {
    ribbonToolbar.elements.searchBtn().should('be.visible');
});

Then(`zoom percentage level is showing {int} in ribbon toolbar`, function (zoomVal) {
    ribbonToolbar.elements.zoomScrollBarInput().should('have.value', zoomVal);
});

Then(`see drafting guidance toggle bar is off in ribbon toolbar`, function () {
    ribbonToolbar.elements.seeUserGuidanceInput().invoke('show').should('not.be.checked');
});

Then(`see drafting guidance toggle bar is on in ribbon toolbar`, function () {
    ribbonToolbar.elements.seeUserGuidanceInput().invoke('show').should('be.checked');
});

Then(`enable track changes toggle bar is off in ribbon toolbar`, function () {
    ribbonToolbar.elements.enableTrackChangesInput().invoke('show').should('not.be.checked');
});

Then(`see track changes toggle bar is on in ribbon toolbar`, function () {
    ribbonToolbar.elements.seeTrackChangesInput().should('have.attr', 'checked', 'checked');
});

When(`click on see drafting guidance toggle bar`, function () {
    ribbonToolbar.clickSeeUserGuidanceToggleBtn();
});

When('enable track changes', () => {
    ribbonToolbar.clickEnableTrackChangesToggleBtn();
})

And(/^enable track changes toggle bar is on in ribbon toolbar$/, function () {
    ribbonToolbar.elements.enableTrackChangesInput().should('have.attr', 'checked', 'checked');
});

Then(/^enable track changes is disabled$/, function () {
    ribbonToolbar.elements.enableTrackChangesToggleBtn().should('have.class', 'eui-slide-toggle__container--disabled');
});

Then(/^see track changes is enabled$/, function () {
    ribbonToolbar.elements.seeTrackChangesToggleBtn().should('not.have.class', 'eui-slide-toggle__container--disabled');
});

Then(/^see track changes is disabled$/, function () {
    ribbonToolbar.elements.seeTrackChangesToggleBtn().should('have.class', 'eui-slide-toggle__container--disabled');
});

Then(/^show clean version button is not present in ribbon toolbar$/, function () {
    ribbonToolbar.elements.showCleanVersionBtn().should('not.exist');
});

When(/^disable track changes$/, function () {
    ribbonToolbar.clickEnableTrackChangesToggleBtn();
});

When(/^click on save button in ribbon toolbar$/, function () {
    ribbonToolbar.clickSaveBtn();
});

And('ribbon toolbar is maximized', () => {
    ribbonToolbar.elements.ribbonToolBarArrowUpBtn().should('be.visible');
})

When(/^minimize ribbon toolbar$/, function () {
    ribbonToolbar.clickRibbonToolBarArrowUpBtn();
});

Then(/^ribbon toolbar is minimized$/, function () {
    ribbonToolbar.elements.ribbonToolBarArrowDownBtn().should('be.visible');
});

When(/^maximize ribbon toolbar$/, function () {
    ribbonToolbar.clickRibbonToolBarArrowDownBtn();
});

When(/^click on zoom in button in ribbon toolbar$/, function () {
    ribbonToolbar.clickZoomInBtn();
});

When(/^click on zoom out button in ribbon toolbar$/, function () {
    ribbonToolbar.clickZoomOutBtn();
});

When(/^click search button in ribbon toolbar$/, function () {
    ribbonToolbar.clickSearchBtn();
});

Then(/^document search bar is displayed$/, function () {
    ribbonToolbar.elements.documentSearchBar().should('be.visible');
});

When(/^put keyword "([^"]*)" in document search input box$/, function (keyword) {
    ribbonToolbar.searchInput(keyword);
});

Then(/^search result is showing "([^"]*)"$/, function (result) {
    ribbonToolbar.elements.searchResults().should('have.text', result);
});

Then(/^number of focus search result is (\d+)$/, function (count) {
    ribbonToolbar.elements.focusSearchResult().should('have.length', count);
});

Then(/^number of other search results are (\d+)$/, function (count) {
    ribbonToolbar.elements.otherSearchResult().should('have.length', count);
});

When(/^click next button in document search bar$/, function () {
    ribbonToolbar.clickNextBtnInSearchControl();
});

When(/^click previous button in document search bar$/, function () {
    ribbonToolbar.clickPreviousBtnInSearchControl();
});

When(/^click on cancel button in document search bar$/, function () {
    ribbonToolbar.clickCancelBtnInSearchControl();
});

Then(/^document search bar is not present$/, function () {
    ribbonToolbar.elements.documentSearchBar().should('not.exist');
});

Then(/^mark as done button is displayed in the ribbon toolbar$/, function () {
    ribbonToolbar.elements.markAsDoneBtn().should('be.visible');
});