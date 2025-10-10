import { Before, After, BeforeStep, AfterStep } from "@badeball/cypress-cucumber-preprocessor";

beforeEach(() => {
    const downloadsFolder = Cypress.config('downloadsFolder');
    cy.task('deleteFolder', downloadsFolder);
    cy.clearLocalStorage();
    cy.clearAllSessionStorage();
    cy.clearCookies();
    cy.window().then((win) => {
        win.sessionStorage.clear();
    });
})

afterEach(() => {
    cy.window().then(win => {
        win.gc?.();
    });
    if (this.currentTest?.state === "failed") {
        const screenshotFileName = `${Cypress.spec.name}/${this.currentTest.title} (failed).png`;
        cy.screenshot(screenshotFileName, { capture: "runner" });
        this.attach(`screenshots/${screenshotFileName}`, "image/png");
    }
});

/*function logToTerminal(message) {
    cy.task("log", message);
}*/

// After(function ({ result, pickle }) {
//     if (result?.status === 'FAILED') {
//         // Find the step that failed
//         const failedStepIndex = result.steps.findIndex(step => step.status === 'FAILED');
//         const failedStep = pickle.steps[failedStepIndex];
//
//         if (failedStep) {
//             console.error(`❌ FAILED STEP: ${failedStep.text}`);
//         }
//     }
// });
// Before each step: only store current step, don't log
// BeforeStep(function ({ pickleStep }) {
//     return cy.window().then((win) => {
//         win.__cucumber_current_step = pickleStep.text;
//         win.__cucumber_current_step_time = Date.now();
//         win.__cucumber_last_fail = null;
//     });
// });

// AfterStep(function ({ pickleStep }) {
//     return cy.window().then((win) => {
//         return logToTerminal(`✔️ Finished Step: ${pickleStep.text} (PASSED)`);
//     });
// });

// Scenario start
// Before(function ({ pickle }) {
//     cy.window().then((win) => {
//         win.__cucumber_last_fail = null;
//         win.__cucumber_current_step = null;
//         win.__cucumber_current_step_time = null;
//     });
//     return logToTerminal(`▶️ Starting Scenario: ${pickle.name}`);
// });

// Scenario end
// After(function ({ pickle }) {
//     return cy.window().then((win) => {
//         const lastFail = win.__cucumber_last_fail;
//         if (lastFail) {
//             return logToTerminal(
//                 `❌ Finished Scenario: ${pickle.name} (FAILED)\n` +
//                 `  Failed step: ${lastFail.step}\n` +
//                 `  Error: ${lastFail.message}\n` +
//                 (lastFail.stack ? `  Stack:\n${lastFail.stack}` : "")
//             );
//         } else {
//             return logToTerminal(`✅ Finished Scenario: ${pickle.name} (PASSED)`);
//         }
//     });
// });