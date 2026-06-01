const env = require("../support/resources/config/environments/env");
const { expect } = require('@playwright/test');

class loginPage {
    constructor(page) {
        this.page = page
        this.userName = "#username"
        this.nextBtn = ".btn-primary"
        this.password = "#password"
        this.loginMethod = ".verif-method-dd-placeholder__icon-container"
        this.passwordLoginMethod = ".verif-method-dd-options #verif-method-dd-PASSWORD"
    }

    async verifyUserName(){
        await expect(this.page.locator(this.userName)).toBeVisible();
    }

    async enterUserName(userName) {
        await this.page.fill(this.userName, userName);
        await this.page.click(this.nextBtn);
    }

    async verifyPassword(){
        await expect(this.page.locator(this.password)).toBeVisible();
    }

    async enterPassword() {
        await this.page.fill(this.password, env.password1);
        await this.page.click(this.loginMethod, { force: true });
        await this.page.click(this.passwordLoginMethod, { force: true });
        await this.page.click(this.nextBtn);
        await this.page.waitForTimeout(5000);
    }
}

module.exports = loginPage;