import { Before, Given, When, And, Then } from "cypress-cucumber-preprocessor/steps";
require('@cypress/xpath');
import dialogBoxPage from "../pages/dialogBoxPage";

Then(`{string} dialog confirm box window is displayed`, (headerValue) => {
    dialogBoxPage.elements.dialogHeader().should('have.text',headerValue);
});

When(`click on ok button in dialog box window`, () => {
    dialogBoxPage.clickAcceptBtn();
});

When(`click on confirm button in dialog box window`, () => {
    dialogBoxPage.clickAcceptBtn();
});

When(`click on delete button in dialog box window`, () => {
    dialogBoxPage.clickDeleteBtn();
});

Then(`dialog box body contains {string}`, (text) => {
    dialogBoxPage.elements.dialogBody().should('include.text', text);
});

When(`click on close button in dialog confirm box window`, () => {
    dialogBoxPage.clickAcceptBtn();
});

Then(`{string} dialog input box window is displayed`, (name) => {
    dialogBoxPage.elements.headerTitle().should('be.visible');
    dialogBoxPage.elements.headerTitle().should('have.text', name);
});

And(`provide input {string} dialog box window`, (input) => {
    dialogBoxPage.elements.input().clear().type(input);
});

And(`input value of dialog box window is {string}`, (input) => {
    dialogBoxPage.elements.input().should('have.value', input);
});

When(`click on save button in dialog input box window`, () => {
    dialogBoxPage.clickAcceptBtn();
});
