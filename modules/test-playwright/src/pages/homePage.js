class homePage {
    constructor(page) {
        this.page = page
        this.euiLabel = page.locator('eui-label.hero-text');
    }

    async getEUILabel() {
        return await this.euiLabel.textContent();
    }
}

module.exports = homePage;