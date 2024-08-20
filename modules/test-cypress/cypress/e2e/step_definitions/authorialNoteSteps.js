import { When, Then } from "cypress-cucumber-preprocessor/steps";
import authorialNoteTable from "../pages/authorialNoteTable";

Then('authorial note table is displayed', function () {
    authorialNoteTable.elements.authorialNoteTable().should('be.visible');
});

Then('text of marker {int} of authorial note table is {string}', function (markerNumber, text) {
    authorialNoteTable.getAuthNote(markerNumber).siblings('text').should('have.text', text);
});

When('click on marker {int} link in authorial note table', function (markerNumber) {
    authorialNoteTable.clickAuthNote(markerNumber);
});