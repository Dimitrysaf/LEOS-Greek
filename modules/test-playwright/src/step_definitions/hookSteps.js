const { BeforeAll, AfterAll, Before, After, Status } = require('@cucumber/cucumber');
const { chromium, firefox } = require('playwright');

const workerIndex = Number(process.env.CUCUMBER_WORKER_ID ?? 0);
const workerNumber = workerIndex + 1;
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let browser;
let browserPromise;

BeforeAll(function () {
    browserPromise = (async () => {
        // Worker 1 = index 0
        // Worker 2 = index 1
        // Worker 3 = index 2
        // Worker 4 = index 3
        const workerDelays = [0, 10000, 13000, 16000];
        const delay = workerDelays[workerIndex] ?? 0;
        console.log(`[${new Date().toISOString()}] Worker ${workerNumber} waiting ${delay / 1000}s`);
        await wait(delay);
        console.log(`[${new Date().toISOString()}] Worker ${workerNumber} launching browser`);

        const browserType = process.env.BROWSER || 'chromium';

        if (browserType === 'firefox') {
            browser = await firefox.launch({
                headless: false,
                args: ['--start-maximized']
            });
        } else if (browserType === 'edge') {
            browser = await chromium.launch({
                channel: 'msedge',
                headless: false,
                args: ['--start-maximized']
            });
        } else if (browserType === 'chrome') {
            browser = await chromium.launch({
                channel: 'chrome',
                headless: false,
                args: ['--start-maximized']
            });
        } else {
            browser = await chromium.launch({
                headless: false,
                args: ['--start-maximized']
            });
        }
    })();
});

Before(async function () {
    await browserPromise;

    this.context = await browser.newContext({
        ignoreHTTPSErrors: true,
        viewport: null
    });

    this.page = await this.context.newPage();
});

After(async function (scenario) {
    try {
        if (
            scenario.result?.status === Status.FAILED &&
            this.page &&
            !this.page.isClosed()
        ) {
            const safeName = scenario.pickle.name
                .replace(/[^a-z0-9]/gi, '_')
                .toLowerCase();

            const screenshot = await this.page.screenshot({
                path: `reports/allure-results/screenshots/${safeName}.png`
            });

            await this.attach(screenshot, 'image/png');
        }
    } finally {
        await this.context?.close();
    }
});

AfterAll(async function () {
    await browser?.close();
});