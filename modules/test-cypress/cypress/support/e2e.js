// ***********************************************************
// This example support/e2e.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************
import './commands';
import "cypress-real-events";

// Suppress XHR/fetch logs in the Cypress command log
const app = window.top;
if (!app.document.head.querySelector('[data-hide-command-log-request]')) {
    const style = app.document.createElement('style');
    style.innerHTML = '.command-name-request, .command-name-xhr { display: none }';
    style.setAttribute('data-hide-command-log-request', '');
    app.document.head.appendChild(style);
}

Cypress.on('uncaught:exception', () => {
    // returning false here prevents Cypress from
    // failing the test
    return false;
})

// Make sure this runs once per spec
// if (!window.__cucumber_fail_handler_installed) {
//     window.__cucumber_fail_handler_installed = true;
//
//     // Capture failure for current step
//     Cypress.on("fail", (err) => {
//         try {
//             window.__cucumber_last_fail = {
//                 message: err.message,
//                 stack: err.stack,
//                 step: window.__cucumber_current_step || "unknown",
//                 time: Date.now(),
//             };
//         } catch (e) {
//             // ignore errors
//         }
//         throw err; // still fail the test
//     });
// }