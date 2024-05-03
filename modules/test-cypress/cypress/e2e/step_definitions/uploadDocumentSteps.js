import { Before, Given, When, And, Then } from "cypress-cucumber-preprocessor/steps";
import uploadDocumentPage from "../pages/uploadDocumentPage";

Then(`active upload window label is {string}`, (label) => {
    uploadDocumentPage.elements.activeStepLabel().contains(label);
});

When(`upload a leg file from a relative location {string}`, (location) => {
    uploadDocumentPage.uploadFile(location);
});

Then(`document title input field is displayed`, () => {
    uploadDocumentPage.elements.documentTitle().should('be.visible');
});

When(`click on create button in upload document page`, () => {
    uploadDocumentPage.clickCreateBtn();
});
 