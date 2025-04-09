import {Then, When} from "cypress-cucumber-preprocessor/steps";
import documentSearchBar from "../pages/documentSearchBar";

Then(/^document search bar is displayed$/, function () {
    documentSearchBar.elements.documentSearchBar().should('be.visible');
});

Then(/^document search bar is not present$/, function () {
    documentSearchBar.elements.documentSearchBar().should('not.exist');
});

When(/^put keyword "([^"]*)" in document search input box$/, function (keyword) {
    documentSearchBar.searchInput(keyword);
});

When(/^click on the replace button from search bar$/, function () {
    documentSearchBar.elements.replaceBtnFromSearchBar().click()
});

Then(/^search result is showing "([^"]*)"$/, function (result) {
    documentSearchBar.elements.searchResults().should('have.text', result);
});

Then(/^number of focus search result is (\d+)$/, function (count) {
    documentSearchBar.elements.focusSearchResult().should('have.length', count);
});

Then(/^number of other search results are (\d+)$/, function (count) {
    documentSearchBar.elements.otherSearchResult().should('have.length', count);
});

When(/^click next button in document search bar$/, function () {
    documentSearchBar.clickNextBtnInSearchControl();
});

When(/^click previous button in document search bar$/, function () {
    documentSearchBar.clickPreviousBtnInSearchControl();
});

When(/^click on cancel button in document search bar$/, function () {
    documentSearchBar.clickCancelBtnInSearchControl();
});

Then(/^document replace bar is displayed$/, function () {
    documentSearchBar.elements.replaceInputInDocumentSearchBar().should('be.visible');
});

When(/^put keyword "([^"]*)" in replace document search input box$/, function (keyword) {
    documentSearchBar.elements.replaceInputInDocumentSearchBar().type(keyword);
});

When(/^click on replace all button from document replace bar$/, function () {
    documentSearchBar.elements.replaceAllButton().click();
});

When(/^click on save and close button from search bar$/, function () {
    documentSearchBar.elements.saveAndCloseBtn().click();
})

Then(/^total occurrences of keyword "([^"]*)" is "(\d+)"$/, function (keyword, expectedCount) {
    const count = Number(expectedCount);
    if (count < '1') {
        documentSearchBar.elements
            .searchResults()
            .should('contain.text', 'Not Found');
    } else {
        documentSearchBar.elements
            .searchResults()
            .should('contain.text', count);
    }
});