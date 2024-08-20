import { When, And, Then } from "cypress-cucumber-preprocessor/steps";
import messageGrowl from "../pages/messageGrowl";
import dialogBoxPage from "../pages/euiDialogBoxPage";
import headerPage from "../pages/headerPage";

And(`extract recent {string} file present in download folder`, (extension) => {
    let path = Cypress.config('downloadsFolder');
    cy.task('getFiles', { downloadsPath: path, extension: extension }).then(before => {
        cy.task('getFiles', { downloadsPath: path, extension: extension }).then(after => {
            const files = after.filter(file => before.includes(file));
            files.forEach((file) => {
                cy.task('unzipping', { path, file });
            });
        })
    })
    cy.wait(2000);
});

Then(`successful message contains {string}`, (message) => {
    messageGrowl.elements.successMessageContent().should('include.text', message);
});

Then(`warning message contains {string}`, (message) => {
    messageGrowl.elements.warningMessageContent().should('include.text', message);
});

Then(`xml files having separator {string} present in download folder contain below names`, (separator, datatable) => {
    let path = Cypress.config('downloadsFolder');
    const givenFileNameList = [];
    let extension = "xml";
    datatable.hashes().forEach((file) => {
        givenFileNameList.push(file.fileName);
    });
    cy.task('getFiles', { downloadsPath: path, extension: extension }).then(before => {
        cy.task('getFiles', { downloadsPath: path, extension: extension }).then(after => {
            const allFiles = after.filter(file => before.includes(file));
            const xmlFiles = [];
            allFiles.forEach((file) => {
                if(file.includes(separator)){
                    xmlFiles.push(file.slice(0, file.indexOf(separator)));
                }
            });
            xmlFiles.forEach(x => expect(givenFileNameList).to.contain(x));
            givenFileNameList.forEach(x => expect(xmlFiles).to.contain(x));
            expect(givenFileNameList.length).to.equal(xmlFiles.length);
            //expect(xmlFiles).to.deep.eq(givenFileNameList);
        });
    });
});

Then(`user is on {string} window`, (windowName) => {
    dialogBoxPage.elements.headerTitle().should('have.text', windowName);
});

When(/^click on workspace button in breadcrumb item$/, function () {
    headerPage.clickWorkspace();
});

When(`click on home button`, () => {
    headerPage.clickHomeBtn();
});