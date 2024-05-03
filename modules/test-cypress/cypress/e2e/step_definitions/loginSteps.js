import {Given, When, And, Then } from "cypress-cucumber-preprocessor/steps";
import loginPage from "../pages/loginPage";

Given('navigate to edit drafting application with {string}', (user) => {
    if(Cypress.env('CE_ENV').includes('@local')) {
        loginPage.visitUrl('localDraftingUrl', 'http://' + Cypress.env('local' + user) + ':' + Cypress.env('localPassword' + user) + '@');
    }
    if(Cypress.env('CE_ENV').includes("@nonlocal")) {
        loginPage.visitUrl('devDraftingUrl', 'https://');
        loginPage.elements.username().should('be.visible');
        loginPage.enterUserName(Cypress.env("remote" + user));
        loginPage.clickNextBtn();
        loginPage.elements.password().should('be.visible');
        loginPage.enterPassword(Cypress.env("remotePassword" + user));
        loginPage.clickSignInBtn();
    }
})

Then('user is on EU login page', () => {
    loginPage.elements.username().should('be.visible');
})

When("user enters username {string}", (userName) =>{
    loginPage.enterUserName(userName);
})

And('user clicks next button', () => {
    loginPage.clickNextBtn()
})

Then('user is on login page', () => {
    loginPage.elements.password().should('be.visible');
})

When("user enters password {string}", (password) =>{
    loginPage.enterPassword(password);
})

And('user clicks on sign in button', () => {
    loginPage.clickSignInBtn();
})