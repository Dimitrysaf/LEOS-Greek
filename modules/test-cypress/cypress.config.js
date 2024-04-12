const { defineConfig } = require("cypress");
const cucumber = require('cypress-cucumber-preprocessor').default;

module.exports = defineConfig({
  video: false,
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
      on('file:preprocessor', cucumber());
    },
    experimentalStudio: true,
    specPattern: "cypress/e2e/js/*.js",
    watchForFileChanges: false
  },
  env: {
    applicationUrl: "http://dasatya:demo@localhost:8080/leos-pilot/ui/workspace",
  }
});
