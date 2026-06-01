const {When, Then, Given} = require("@cucumber/cucumber");
const {expect} = require("../../src/support/timeout.js");

Then(/^ck editor window is displayed$/, async function () {
    await this.page.waitForTimeout(1000);
    await expect(this.page.locator(".cke_editable.cke_editable_inline")).toBeVisible();
});

Then(/^ck editor window is not displayed$/, async function () {
    await expect(this.page.locator(".cke_editable.cke_editable_inline")).toHaveCount(0);
});

When(/^click save and close button of ck editor$/, async function () {
    await this.page.locator(".cke_button__leosinlinesaveclose").click();
    await this.page.waitForTimeout(2000);
});

When(/^append "([^"]*)" at offset (\d+) in numbered paragraph (\d+) of article in edition mode$/, async function (content, offSet, paragraphNumber) {
    const id = await this.page.locator(".cke_editable.cke_editable_inline").locator(`article ol li[data-akn-name="aknNumberedParagraph"][data-akn-num="${paragraphNumber}."]`).getAttribute("id");
    // this.page.on('console', msg => console.log('BROWSER:', msg.text()));
    await addContent(this.page, id, content, 0, offSet);
});

When(/^move the cursor position to offset (\d+) in paragraph (\d+) of article in edition mode$/, async function (offSet, paragraphNumber) {
    const id = await this.page.locator(".cke_editable.cke_editable_inline").locator(`article ol li[data-akn-name="aknNumberedParagraph"][data-akn-num="${paragraphNumber}."]`).getAttribute("id");
    await moveCursor(this.page, id, 0, offSet);
});

/*Then(/^numbered paragraph (\d+) of article contains "([^"]*)" in edition mode$/, function (paragraphNumber, articleNumber) {

});

When(/^click at offset (\d+) of child (\d+) of li (\d+) with data-akn-element "([^"]*)" of article in edition mode$/, function (offSet, child, li, dataAknElement) {

});*/

async function addContent(page, element, newContent, childIndex = 0, offset = 0) {
    await page.evaluate(
        ({ element, childIndex, offset, newContent }) => {
            const editorKeys = Object.keys(window.CKEDITOR.instances);
            if (!editorKeys.length) return;
            const editor = window.CKEDITOR.instances[editorKeys[0]];
            // Find the offer element inside CKEditor
            const offerElement = editor.element.findOne('#' + element);
            if (!offerElement) return;
            // Choose child node to place the cursor
            const targetChild = offerElement.getChild(childIndex);
            if (!targetChild) return;
            // Create range and set cursor
            const range = editor.createRange();
            range.moveToPosition(targetChild, window.CKEDITOR.POSITION_AFTER_START);
            range.setStart(targetChild, offset);
            range.setEnd(targetChild, offset);
            range.collapse(true);
            range.select();
            // Insert the content
            editor.insertHtml(newContent);
            // Fire change event
            editor.fire('change');
        },
        { element, childIndex, offset, newContent }
    );
}

async function  moveCursor(page, element, child = 0, offset = 0) {
    await page.evaluate(
        ({ element, child, offset }) => {
            const editorKeys = Object.keys(window.CKEDITOR.instances);
            if (!editorKeys.length) return;
            const editor = window.CKEDITOR.instances[editorKeys[0]];
            // Find the offer element inside CKEditor
            const elementParent = editor.element.findOne('#' + element);
            // Get the child element to put the cursor in
            const elementCursor = elementParent.getChild(child);

            // Create a range and set cursor position
            const range = editor.createRange();
            range.moveToPosition(elementCursor, window.CKEDITOR.POSITION_AFTER_START);
            range.setStart(elementCursor, offset);
            range.setEnd(elementCursor, offset);
            range.collapse(true);

            // Force selection to this range
            const selection = editor.getSelection();
            selection.removeAllRanges();
            selection.selectRanges([range]);

            // Focus the editor
            editor.focus();
        },
        { offset, element, child }
    );
}