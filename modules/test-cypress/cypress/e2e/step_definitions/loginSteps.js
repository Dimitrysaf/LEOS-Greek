import {Given, When, And, Then } from "cypress-cucumber-preprocessor/steps";
import loginPage from "../pages/loginPage";

Given('navigate to {string} edit drafting application', (environment) => {
        loginPage.visitUrl(environment);
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