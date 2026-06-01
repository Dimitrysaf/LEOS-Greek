module.exports = {
    default: {
        require: ['./src/support/timeout.js','./src/step_definitions/**/*.js'],
        paths: ["./src/features"],
        format: [
            'progress',
            'summary',
            'json:reports/cucumber-report.json',
            // 'allure-cucumberjs/reporter'
            "allure-cucumberjs/reporter:reports/allure-results/allure-output.txt"
        ],
        formatOptions: {
            resultsDir: 'reports/allure-results'
        },
        defaultTimeout: 30 * 1000,
        publishQuiet: false,
        parallel: 4,
        "retry": 0
    }
};