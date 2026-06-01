const development = require("./development.env.js");
const test = require("./test.env.js");
const local = require("./local.env.js");

const ENV = process.env.ENVIRONMENT || "local";

const environments = {
    development,
    test,
    local
};

const config = environments[ENV];

if (!config) {
    throw new Error(`Invalid environment: ${ENV}`);
}
config.environment = ENV;
module.exports = config;