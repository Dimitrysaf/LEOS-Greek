const report = require("multiple-cucumber-html-reporter");

report.generate({
  jsonDir: "./cypress/report/",
  reportPath: "./cypress/report/",
  metadata: {
    browser: {
      name: "Chrome",
      version: "123",
    },
    device: "Local Machine",
    platform: {
      name: "Windows Server",
      version: "2019 datacentre",
    },
  },
});