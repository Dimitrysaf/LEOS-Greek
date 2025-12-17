import {When, Then} from "@badeball/cypress-cucumber-preprocessor";
import euiDialogBoxPage from "../pages/euiDialogBoxPage";
import ckEditorWindow from "../pages/ckEditorWindow";

Then(`{string} dialog confirm box window is displayed`, (headerValue) => {
    euiDialogBoxPage.elements.dialogHeader().should('have.text',headerValue);
});

When(`click on ok button in dialog box window`, () => {
    euiDialogBoxPage.clickAcceptBtn();
});

When(`click on confirm button in dialog box window`, () => {
    euiDialogBoxPage.clickAcceptBtn();
});

When(`click on delete button in dialog box window`, () => {
    euiDialogBoxPage.clickDeleteBtn();
});

When(`click on danger button in dialog box window`, () => {
    euiDialogBoxPage.clickDangerButton();
});

Then(`dialog box body contains {string}`, (text) => {
    euiDialogBoxPage.elements.dialogBody().should('include.text', text);
});

Then(/^dialog box body doesn't contain "([^"]*)"$/, function (text) {
    euiDialogBoxPage.elements.dialogBody().should('not.include.text', text);
});

When(`click on close button in dialog confirm box window`, () => {
    euiDialogBoxPage.clickAcceptBtn();
});

Then(`{string} dialog box window is displayed`, (name) => {
    euiDialogBoxPage.elements.headerTitle().should('be.visible');
    euiDialogBoxPage.elements.headerTitle().should('have.text', name);
});

When(`provide input {string} dialog box window`, (input) => {
    euiDialogBoxPage.elements.input().clear().type(input);
});

Then(`input value of dialog box window is {string}`, (input) => {
    euiDialogBoxPage.elements.input().should('have.value', input);
});

When(`click on save button in dialog input box window`, () => {
    euiDialogBoxPage.clickAcceptBtn();
});

When('click on revert button in dialog box', function () {
    euiDialogBoxPage.clickAcceptBtn();
});

When(`click on confirm button in dialog confirm box window`, function () {
    euiDialogBoxPage.clickConfirmBtn();
});

When(/^click on cancel button in dialog box window$/, function () {
    euiDialogBoxPage.clickCancelBtn();
});

Then(/^example box (\d+) contains "([^"]*)"$/, function (boxNumber, content) {
    euiDialogBoxPage.elements.exampleBoxNgContent().eq(boxNumber-1).should('include.text', content);
});

Then(/^no dialog box window present$/, function () {
    euiDialogBoxPage.elements.dialogBox().should('not.exist');
});

When(/^click on dismiss close button in dialog box window$/, function () {
    euiDialogBoxPage.clickDismissCloseBtn();
});

When(/^drag row (\d+) and drop on row (\d+) in dialog box window$/, function (dragRow, dropRow) {
    euiDialogBoxPage.elements.exampleBoxNgContent().eq(dragRow-1)
        .trigger("mousedown", {button: 0, force: true})
        .trigger("mousemove", 0, 10, {force: true})
        .wait(200);
    euiDialogBoxPage.elements.exampleBoxNgContent().eq(dropRow-1).trigger("mousemove", {force: true}).trigger("mouseup", {force: true});
});

When(/^click on archive button$/, function () {
    euiDialogBoxPage.clickArchiveBtn();
});

Then ('{string} dialog box is displayed', function (headerValue) {
    euiDialogBoxPage.elements.dialogBox().contains(headerValue)
});

Then('contains message {string} in dialog box', function (message) {
    euiDialogBoxPage.elements.dialogBox().should('include.text', message);
});




