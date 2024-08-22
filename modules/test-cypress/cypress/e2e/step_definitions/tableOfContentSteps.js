import {When, And, Then} from "cypress-cucumber-preprocessor/steps";
import tableOfContent from "../pages/tableOfContent";

And('toc editing button is displayed and enabled', () => {
    tableOfContent.elements.editBtn().should('be.visible');
    tableOfContent.elements.editBtn().should('not.be.disabled');
})

When(`click on toc edit button`, () => {
    tableOfContent.clickEditBtn();
});

Then(`below element lists are displayed in Elements menu`, (datatable) => {
    const actualElementList = [];
    datatable.hashes().forEach((element) => {
        actualElementList.push(element.ElementList);
    });
    tableOfContent.elements.menuOptions()
        .then(($els) => {
            return (
                Cypress.$.makeArray($els)
                    .map((el) => el.innerText)
            )
        })
        .should('deep.equal', actualElementList)
});

When(`click on versions pane accordion`, () => {
    tableOfContent.clickVersionsPaneButton();
});

When(`click on contributions pane accordion`, () => {
    tableOfContent.clickContributionsPaneButton();
});

Then(`compare versions button is displayed in versions pane section`, () => {
    tableOfContent.elements.compareBtn().should('be.visible');
});

Then(`search button is displayed in versions pane section`, () => {
    tableOfContent.elements.searchBtn().should('be.visible');
});

Then(`{string} subtitle is displayed under recent changes version card`, (subtitle) => {
    tableOfContent.elements.recentChangesVersionCardSubTitle().should("have.text", subtitle);
});

Then(`last version card header title contains {string}`, (headerTitle) => {
    tableOfContent.elements.lastVersionCardHeaderTitle().should("have.text", headerTitle);
});

When(`click on navigation pane accordion`, () => {
    tableOfContent.clickNavigationPaneAccordian();
});

When(`only title element is present in navigation pane`, () => {
    tableOfContent.elements.nestedTreeNode().should('have.length', 1);
    tableOfContent.elements.nestedTreeNode().should("have.text", 'Title ');
});

When(`click on title link in navigation pane`, () => {
    tableOfContent.clickFirstNestedTreeNode();
});

And(`last subversion of recent changes version card contains {string}`, (subversion) => {
    tableOfContent.getLatestRecentVersionCardContent().should('have.text', subversion);
});

Then(`cancel button is displayed and enabled in navigation pane`, () => {
    tableOfContent.elements.cancelBtn().should('be.visible');
    tableOfContent.elements.cancelBtn().should('not.be.disabled');
});

When(`click on cancel button in navigation pane`, () => {
    tableOfContent.clickCancelBtn();
});

When(`click on save button in navigation pane`, () => {
    tableOfContent.clickSaveBtn();
});

When(`click on save and close button in navigation pane`, () => {
    tableOfContent.clickSaveCloseBtn();
});

Then(`elements list is not displayed in navigation pane`, () => {
    tableOfContent.elements.menuOptions().should('not.exist');
});

When(`mouseover on change type category`, () => {
    tableOfContent.mouseHoverOnChangeTypeBtn();
});

When(`click on definition option in change type category`, () => {
    tableOfContent.clickDefinitionArticleTypeBtn();
});

When(`click on regular option in change type category`, () => {
    tableOfContent.clickRegularArticleTypeBtn();
});

Then(`regular option is selected in change type category`, () => {
    tableOfContent.elements.regularArticleTypeBtn().should('be.disabled');
});

Then(`definition option is selected in change type category`, () => {
    tableOfContent.elements.definitionArticleTypeBtn().should('be.disabled');
});

When(`click on three vertical dots for the element contains text {string} in toc`, (ngContent) => {
    tableOfContent.clickThreeDotsOfTOCElement(ngContent);
});

When(`click on {string} link in navigation pane`, (link) => {
    tableOfContent.clickLinkInNavigationPane(link);
});

When(`click on show more button in {string} eui-card`, (euiCardName) => {
    tableOfContent.clickShowMoreBtn(euiCardName);
});

Then(`title of last {int} minor versions from recent changes eui-card contains {string}`, (minorVersionNumber, euiCardStr) => {
    tableOfContent.elements.subVersionTitle().each(($ele, index) => {
        if (index < minorVersionNumber) {
            expect($ele.text()).to.equal(euiCardStr);
        }
    })
});

When(`click on right angle icon of preamble link`, () => {
    tableOfContent.clickRightAngleIconOfPreambleLink();
});

Then('navigation pane is expanded', function () {
    tableOfContent.elements.navigationPaneExpanded().should('be.visible');
});

Then(/^navigation pane is minimized$/, function () {
    tableOfContent.elements.navigationPaneMinimized().should('be.visible');
});

When('drag node label {string} and drop to node label {string} in navigation pane', function (dragLabel, dropLabel) {
    tableOfContent.getNodeLabelText(dragLabel)
        .trigger("mousedown", {button: 0, force: true})
        .trigger("mousemove", 0, 10, {force: true})
        .wait(200);
    tableOfContent.getNodeLabelText(dropLabel).trigger("mousemove", {force: true})
        .wait(200)
        .trigger("mouseup", {force: true});
});

When('drag element {string} from element tree list and drop to node label {string} in navigation pane', function (dragElement, dropLabel) {
    tableOfContent.elements.elementList().contains(dragElement)
        .trigger("mousedown", {button: 0, force: true})
        .trigger("mousemove", 0, 10, {force: true})
        .wait(200);
    tableOfContent.getNodeLabelText(dropLabel).trigger("mousemove", {force: true})
        .wait(200)
        .trigger("mouseup", {force: true});
});

Then('enacting terms contains node label {string} and showing as bold', function (label) {
    tableOfContent.getLabelExtended().contains(label).should('exist').should('have.class', 'leos-soft-new');
});

Then('enacting terms contains node label {string}', function (label) {
    tableOfContent.getLabelExtended().contains(label).should('be.visible');
});

When('click on revert to this version', function () {
    tableOfContent.clickRevertToThisVersion()
});

When('click on three vertical dots of card header title {string} in version pane', function (headerTitle) {
    tableOfContent.clickThreeDotsOfCardHeader(headerTitle);
});

When('{string} is showing as soft move title in navigation pane', function (title) {
    tableOfContent.elements.nodeLabel().find('span.leos-soft-move-title').should('include.text', title).should('be.visible');
});

When('{string} is showing as soft move label with soft move title {string} in navigation pane', function (label, title) {
    tableOfContent.elements.nodeLabel().find('span.leos-soft-move-title').should('include.text', title).siblings('span.leos-soft-move-label').should('include.text', label).should('be.visible');
});

Then('toc editing button is not present', function () {
    tableOfContent.elements.editBtn().should('not.exist');
});

Then('only below options are displayed in dropdown content', function (datatable) {
    const actualOptionList = [];
    datatable.hashes().forEach((element) => {
        actualOptionList.push(element.dropdownContent);
    });
    tableOfContent.elements.dropdownItemContentTextList()
        .then(($els) => {
            return (
                Cypress.$.makeArray($els)
                    .map((el) => el.innerText.trim())
            )
        })
        .should('deep.equal', actualOptionList)
});

Then('subversion {int} of recent changes version card contains {string}', function (subVersionNumber,subVersionText) {
    tableOfContent.getSubVersion(subVersionNumber).should('include.text', subVersionText);
});

When(`click on contributions pane accordion`, () => {
    tableOfContent.clickContributionsPaneButton();
});

When(`click on first contribution`, () => {
    tableOfContent.clickFirstContribution();
});
