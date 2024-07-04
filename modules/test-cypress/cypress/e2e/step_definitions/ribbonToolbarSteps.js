import {When, Then} from "cypress-cucumber-preprocessor/steps";
import ribbonToolbar from "../pages/ribbonToolBar";

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

Then(`zoom percentage level is showing {string} in ribbon toolbar`, function (zoomPercentage) {
    ribbonToolbar.elements.zoomValue().should('include.text', zoomPercentage);
});

Then(`see user guidance toggle bar is off in ribbon toolbar`, function () {
    ribbonToolbar.elements.seeUserGuidanceInput().invoke('show').should('not.be.checked');
});

Then(`see user guidance toggle bar is on in ribbon toolbar`, function () {
    ribbonToolbar.elements.seeUserGuidanceInput().invoke('show').should('be.checked');
});

Then(`enable track changes toggle bar is off in ribbon toolbar`, function () {
    ribbonToolbar.elements.enableTrackChangesInput().invoke('show').should('not.be.checked');
});

Then(`see track changes toggle bar is on in ribbon toolbar`, function () {
    ribbonToolbar.elements.seeTrackChangesInput().should('have.attr', 'checked', 'checked');
});

When(`click on see user guidance toggle bar`, function () {
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