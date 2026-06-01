import {Then, When} from '@cucumber/cucumber';
import {expect} from '@playwright/test';

When(/^click on toc edit button$/, async function () {
    await this.page.locator("*[icon='eui-ecl-edit']").click();
    await this.page.waitForTimeout(2000);
});

When(/^drag element "([^"]*)" from element tree list and drop before node label "([^"]*)" in navigation pane$/, async function (drag,drop) {
    const target = this.page.locator(".mat-tree-node div.label[id^='node-label']").getByText(drop).locator('xpath=ancestor::li[1]').locator("xpath=preceding-sibling::div[@class='drop-placeholder'][1]");
    await target.evaluate(el => {
        el.setAttribute('style', 'height: 24px; display: block;');
    });
    const source = this.page.locator('li.eui-list-item:nth-child(7)');
    await dragAndDrop.call(this, source, target);
    await this.page.waitForTimeout(3000);
});

When(/^drag element "([^"]*)" from element tree list and drop after node label "([^"]*)" in navigation pane$/, async function (drag,drop) {
    const target = this.page.locator(".mat-tree-node div.label[id^='node-label']").getByText(drop).locator('xpath=ancestor::li[1]').locator("xpath=following-sibling::div[@class='drop-placeholder'][1]");
    await target.evaluate(el => {
        el.setAttribute('style', 'height: 24px; display: block;');
    });
    const source = this.page.locator('li.eui-list-item:nth-child(7)');
    await dragAndDrop.call(this, source, target);
    await this.page.waitForTimeout(3000);
});

When(/^click on save and close button in navigation pane$/, async function () {
    await this.page.locator("button img[src='assets/images/toc-save-close.png']").click();
    await this.page.waitForTimeout(2000);
});

Then(/^toc editing button is displayed and enabled$/, async function () {
    await expect(this.page.locator("*[icon='eui-ecl-edit']")).toBeVisible();
});

async function dragAndDrop(sourceLocator, targetLocator) {
    await sourceLocator.scrollIntoViewIfNeeded();
    await targetLocator.scrollIntoViewIfNeeded();

    const sourceBox = await sourceLocator.boundingBox();
    const targetBox = await targetLocator.boundingBox();

    if (!sourceBox || !targetBox) throw new Error('Element not visible for drag-and-drop');

    await this.page.mouse.move(
        sourceBox.x + sourceBox.width / 2,
        sourceBox.y + sourceBox.height / 2
    );
    await this.page.mouse.down();
    await this.page.mouse.move(
        targetBox.x + targetBox.width / 2,
        targetBox.y + targetBox.height / 2,
        { steps: 15 }
    );
    await this.page.mouse.up();
}