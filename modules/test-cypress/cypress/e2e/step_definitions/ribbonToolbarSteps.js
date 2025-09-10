import {When, Then} from "@badeball/cypress-cucumber-preprocessor";
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

Then(/^enable track changes toggle bar is on in ribbon toolbar$/, function () {
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

Then('ribbon toolbar is maximized', () => {
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
    cy.wait(1000)
});

Then(/^mark as done button is displayed in the ribbon toolbar$/, function () {
    ribbonToolbar.elements.markAsDoneBtn().should('be.visible');
});

When('close the comparison section from the ribbon bar',function (){
    ribbonToolbar.clickCancelVersionCompareContainer();
});

Then(/^compare section is displayed in ribbon toolbar$/, function () {
    ribbonToolbar.elements.compareContainer().should('be.visible');
});

Then(/^compare section is not displayed in ribbon toolbar$/, function () {
    ribbonToolbar.elements.compareContainer().should('not.exist');
});

Then('eui-label {string} is displayed in compared section of ribbon toolbar', function (euiLabel) {
    ribbonToolbar.elements.comparisonEUILabel().should('have.text', euiLabel);
});

When(/^click close button of merge section in ribbon toolbar$/, function () {
    ribbonToolbar.clickCloseBtnMergeSection();
});