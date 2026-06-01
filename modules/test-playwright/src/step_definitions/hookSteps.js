const { BeforeAll, AfterAll, Before, After, Status } = require('@cucumber/cucumber');
const { chromium, firefox } = require('playwright');
const fs = require('fs');
//
// ---------- Worker index (executed once per process) ----------
//
function assignWorkerIndex() {
    const file = '.workers';

    let index = 0;
    if (fs.existsSync(file)) {
        index = parseInt(fs.readFileSync(file, 'utf8')) || 0;
    }

    fs.writeFileSync(file, String(index + 1));
    return index;
}

const workerIndex = assignWorkerIndex();
console.log(`Process ${process.pid} assigned worker ${workerIndex}`);

let browser;
let browserPromise; // <-- important

BeforeAll(function () {
    browserPromise = (async () => {
        const delay = workerIndex * 2000;

        console.log(`Worker ${workerIndex} delaying browser start by ${delay} ms`);
        await new Promise(r => setTimeout(r, delay));

        const browserType = process.env.BROWSER || 'chromium';

        if (browserType === 'firefox') {
            browser = await firefox.launch({ headless: false, args: ['--start-maximized'] });
        } else if (browserType === 'edge') {
            browser = await chromium.launch({ channel: 'msedge', headless: false, args: ['--start-maximized'] });
        } else if (browserType === 'chrome') {
            browser = await chromium.launch({ channel: 'chrome', headless: false, args: ['--start-maximized'] });
        } else {
            browser = await chromium.launch({ headless: false, args: ['--start-maximized'] });
        }
    })();
});

Before(async function () {
    // wait until browser is fully initialized
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