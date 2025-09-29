const report = require("multiple-cucumber-html-reporter");

report.generate({
  jsonDir: 'cypress/report',
  reportPath: 'cypress/report',
  metadata: {
    browser: {
      name: "Chrome",
      version: "139",
    },
    device: "GitLab Runner",
    platform: {
      name: "Ubuntu Linux Server",
      version: "22.4",
    },
  },
});