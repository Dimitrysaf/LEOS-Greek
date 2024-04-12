import {Given, When, And, Then } from "cypress-cucumber-preprocessor/steps";
import loginPage from "../pages/loginPage";

Given('navigate to edit drafting application', () => {
    loginPage.visitUrl();
})

// Then('user is on EU login page', () => {
//     cy.get('#username').should('be.visible');
// })

// When("user enters username {string}", (userName) =>{
//     cy.get('#username').type(userName);
// })

// And('user clicks next button', () => {
//     cy.get('.btn-primary').click();
//     cy.wait(2000)
// })

// Then('user is on login page', () => {
//     cy.get('#password').should('be.visible');
// })

// When("user enters password {string}", (userName) =>{
//     cy.get('#password').type(userName);
// })

// And('user clicks on sign in button', () => {
//     cy.get('.btn-primary').click();
//     cy.wait(10000);
// })