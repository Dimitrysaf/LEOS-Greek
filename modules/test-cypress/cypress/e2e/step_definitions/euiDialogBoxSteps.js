import { When, And, Then } from "cypress-cucumber-preprocessor/steps";
import euiDialogBoxPage from "../pages/euiDialogBoxPage";

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

When(`click on close button in dialog confirm box window`, () => {
    euiDialogBoxPage.clickAcceptBtn();
});

Then(`{string} dialog box window is displayed`, (name) => {
    euiDialogBoxPage.elements.headerTitle().should('be.visible');
    euiDialogBoxPage.elements.headerTitle().should('have.text', name);
});

And(`provide input {string} dialog box window`, (input) => {
    euiDialogBoxPage.elements.input().clear().type(input);
});

And(`input value of dialog box window is {string}`, (input) => {
    euiDialogBoxPage.elements.input().should('have.value', input);
});

When(`click on save button in dialog input box window`, () => {
    euiDialogBoxPage.clickAcceptBtn();
});

When('click on revert button in dialog box', function () {
    euiDialogBoxPage.clickAcceptBtn();
});

And(`click on confirm button in dialog confirm box window`, function () {
    euiDialogBoxPage.clickConfirmBtn();
});

When(/^click on cancel button in dialog box window$/, function () {
    euiDialogBoxPage.clickCancelBtn();
});