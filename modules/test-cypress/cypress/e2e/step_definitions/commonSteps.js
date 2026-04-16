import {When, Then} from "@badeball/cypress-cucumber-preprocessor";
import messageGrowl from "../pages/messageGrowl";
import headerPage from "../pages/headerPage";

When(`extract recent {string} file present in download folder`, (extension) => {
    let path = Cypress.config('downloadsFolder');
    // TODO: After implementation in the code, check for successful download message before proceeding further.
    /* if(extension === "zip"){
        cy.task('getLatestFileName', path).then((latestFileName) => {
            expect(latestFileName.startsWith('main-')).to.be.true;
        });
    } */
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

When(/^click on act view link in breadcrumb item$/, function () {
    headerPage.clickActView();
});

When(/^click on workspace button in breadcrumb item$/, function () {
    headerPage.clickWorkspace();
});

When(/^click on home link in breadcrumb item$/, function () {
    headerPage.clickHomeLink();
});

When(`click on home button`, () => {
    headerPage.clickHomeBtn();
});

When(/^wait for (\d+) milliseconds$/, function (milliSeconds) {
    cy.wait(milliSeconds);
});

When(/^refresh the browser$/, function () {
    cy.reload();
});

Then(/^"([^"]*)" is displayed$/, function (content) {
    cy.contains(content).should('be.visible');
});

When('click on tab key from keyboard', function () {
    cy.realPress('Tab', {});
});

Then('the version on the top of the document page is {string}', function (version) {
    headerPage.elements.documentVersionLabel().should('contain.text', version);
});