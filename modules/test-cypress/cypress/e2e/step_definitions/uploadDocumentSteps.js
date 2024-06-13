import { Before, Given, When, And, Then } from "cypress-cucumber-preprocessor/steps";
import uploadDocumentPage from "../pages/uploadDocumentPage";

Then(`active upload window label contains {string}`, (label) => {
    uploadDocumentPage.elements.activeStepLabel().contains(label);
});

When(`upload a leg file from a relative location {string}`, (location) => {
    uploadDocumentPage.uploadFile("cypress/fixtures/legFiles/" + location);
});

When(`upload recent leg file from downloads folder`, () => {
    let path = Cypress.config('downloadsFolder');
    let extension = 'leg';
    cy.task('getFiles', { downloadspath: path, extension: extension }).then(before => {
        cy.task('getFiles', { downloadspath: path, extension: extension }).then(after => {
            const files = after.filter(file => before.includes(file));
            let index = 0;
            while (index < files.length) {
                if(files[index].split('.').pop().includes("leg")){
                    uploadDocumentPage.uploadFile(path + "/" + files[index]);
                    break;
                }
                index++;
            }
        })
    })
});


Then(`document title input field is displayed`, () => {
    uploadDocumentPage.elements.documentTitle().should('be.visible');
});

When(`click on create button in upload document page`, () => {
    uploadDocumentPage.clickCreateBtn();
});
 
And('provide document title {string} in upload document page', (title) => {
    uploadDocumentPage.enterProposalTitle(title);
})