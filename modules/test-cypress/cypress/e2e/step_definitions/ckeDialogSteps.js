import { When, Then } from "@badeball/cypress-cucumber-preprocessor";
import ckeDialogWindow from "../pages/ckeDialogWindow";

Then(`cke dialog window is displayed with title {string}`, (title) => {
    ckeDialogWindow.elements.dialogTitle().should('have.text', title);
});

Then(`cke dialog window is displayed with body {string}`, function (content) {
    ckeDialogWindow.elements.dialogContent().should('have.text', content);
});

When(`click on ok button in cke dialog window`, () => {
    ckeDialogWindow.clickOkBtn();
});

When('type {string} in cke dialog textarea', function (text) {
    ckeDialogWindow.typeInCkeDialogTextArea(text);
});

When('click on cell {int} of row {int} of special character table in cke dialog window', function (cell, row) {
    ckeDialogWindow.clickTrTdDialogUIHBoxTable(cell, row);
});

Then('click dialog ok button', () => {
    ckeDialogWindow.clickDialogOkBtn();
});

Then('click on dialog cancel button', () => {
    ckeDialogWindow.clickDialogCancelBtn();
});

When('click on cancel button in cke dialog window', () => {
   ckeDialogWindow.clickCancelButton()
})