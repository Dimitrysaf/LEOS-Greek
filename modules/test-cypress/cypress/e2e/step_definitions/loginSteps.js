import {Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";
import loginPage from "../pages/loginPage";

Given("navigate to leos application with {string}", (user) => {
    if(Cypress.env('CE_ENV').includes('@focus')) {
        loginPage.visitUrl('localDraftingUrl', 'http' + '://' + Cypress.env('local' + user) + ':' + Cypress.env('localPassword') + '@');
    }
});

Given("navigate to edit application with {string}", (user) => {
    if(Cypress.env('CE_ENV').includes('feature')) {
        cy.visit(Cypress.env('eCasProductionUrl'));
    }
    else{
        cy.visit(Cypress.env('eCasAcceptanceUrl'));
    }
    loginPage.elements.username().should('be.visible');
    loginPage.enterUserName(Cypress.env("remote" + user));
    loginPage.clickNextBtn();
    loginPage.elements.password().should('be.visible');
    loginPage.enterPassword(Cypress.env("remotePassword" + user));
    loginPage.clickVerificationDropDown();
    loginPage.selectPasswordVerificationMethod();
    loginPage.clickSignInBtn();
    loginPage.getInformationMessage().should('eq','You are now logged in to EU Login.');
    cy.visit(Cypress.env(Cypress.env('CE_ENV') + 'DraftingUrl'));
    cy.wait(5000);
});




Then('user is on EU login page', () => {
    loginPage.elements.username().should('be.visible');
})

When("user enters username {string}", (userName) =>{
    loginPage.enterUserName(userName);
})

When('user clicks next button', () => {
    loginPage.clickNextBtn()
})

Then('user is on login page', () => {
    loginPage.elements.password().should('be.visible');
})

When("user enters password {string}", (password) =>{
    loginPage.enterPassword(password);
})

When('user clicks on sign in button', () => {
    loginPage.clickSignInBtn();
})