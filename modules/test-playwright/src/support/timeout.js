const { expect: baseExpect } = require('@playwright/test');
const { setDefaultTimeout } = require('@cucumber/cucumber');

// Configure Playwright assertion timeout
const expect = baseExpect.configure({
    timeout: 30000
});

// Configure Cucumber step timeout
setDefaultTimeout(30000);

module.exports = { expect };
