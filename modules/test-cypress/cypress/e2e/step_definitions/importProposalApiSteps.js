import {Given, Then } from "cypress-cucumber-preprocessor/steps";
import FormData from 'form-data';

Given('Send a POST request to import proposal', () => {
    let url, bearerToken;
    if(Cypress.env('CE_ENV').includes('@local')) {
        url = Cypress.env('localImportProposalApiUrl');
        bearerToken = Cypress.env('bearerTokenLocalUser1');
    }
    if(Cypress.env('CE_ENV').includes("@nonlocal")) {
        url = Cypress.env('devImportProposalApiUrl');
        bearerToken = Cypress.env('bearerTokenRemoteUser1');
    }
    cy.fixture('/legFiles/PROP_ACT-clxkd3t4k000uok58ltymp0m5-es.leg', 'binary')
        .then(Cypress.Blob.binaryStringToBlob)
        .then((fileContent) => {
            const formData = new FormData();
            formData.append('legFile', fileContent, '/legFiles/PROP_ACT-clxkd3t4k000uok58ltymp0m5-es.leg');

            cy.request({
                method: 'POST',
                url: url,
                headers: {
                    'Authorization': 'Bearer ' + bearerToken,
                    'Content-Type': 'multipart/form-data'
                },
                body: formData,
                failOnStatusCode: false
            }).as('apiResponse');
        });
});
Then('the response status code should be 200 or match failure conditions', () => {
    cy.get('@apiResponse').then((response) => {
        const decode = new TextDecoder('utf-8');
        const responseBody = decode.decode(response.body);

        if (response.status === 200) {
            expect(response.status).to.eq(200);
            expect(responseBody).to.include('proposalId');
        } else if(response.status === 202) {
            expect(response.status).to.eq(202);
            expect(responseBody).to.include('Document found and updated with major version');
        } else if(response.status === 404) {
            // Handle failure conditions
            expect(response.status).to.eq(404);
            expect(responseBody).to.include('Original proposal not found for the uploaded translated version');
        } else {
            // Handle failure conditions
            expect(response.status).to.eq(500);
            expect(responseBody).to.include('The uploaded document version already exists. Please upload another version');
        }
    });
});

