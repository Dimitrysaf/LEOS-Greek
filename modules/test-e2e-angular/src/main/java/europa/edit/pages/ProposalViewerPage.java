package europa.edit.pages;

import europa.edit.util.Constants;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.CacheLookup;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.pagefactory.AjaxElementLocatorFactory;

import static europa.edit.util.E2eUtil.*;

public class ProposalViewerPage extends HeaderPage {

    private final WebDriver driver;

    @FindBy(xpath = "//*[@class='eui-tab-item__label' and text()='Milestones']")
    @CacheLookup
    WebElement MILESTONES_TAB;

/*
    @FindBy(xpath = "//*[@class='eui-tab-item__label' and text()='Collaborators']")
    @CacheLookup
    WebElement COLLABORATORS_TAB;
*/

    @FindBy(xpath = "//*[@class='eui-label' and text()='Actions']")
    @CacheLookup
    WebElement ACTIONS_BTN;

    @FindBy(css = ".eui-u-flex-align-items-start h1")
    @CacheLookup
    WebElement PROPOSAL_TITLE;

/*    @FindBy(css = "app-proposal-details .eui-fieldset__container")
    @CacheLookup
    WebElement PROPOSAL_DETAILS_CONTAINER;*/

    @FindBy(css = "div.eui-tab-item--active .eui-tab-item__label")
    @CacheLookup
    WebElement ACTIVE_TAB;

    @FindBy(css = "app-proposal-header header>button[translate='global.actions.close']")
    @CacheLookup
    WebElement CLOSE_BTN;

    @FindBy(xpath = "//*[text()='Cover Page']")
    @CacheLookup
    WebElement COVER_PAGE;

    @FindBy(xpath = "//*[text()='Explanatory Memorandum']")
    @CacheLookup
    WebElement EXP_MEMO;

    @FindBy(xpath = "//*[text()='Legal Act']")
    @CacheLookup
    WebElement LEGAL_ACT;

    @FindBy(xpath = "//*[text()='Financial Statement']")
    @CacheLookup
    WebElement FINANCE_STATEMENT;

    @FindBy(xpath = "//*[text()='Annexes']")
    @CacheLookup
    WebElement ANNEXES;

    @FindBy(xpath = "//*[text()='Annexes']//ancestor::div[@class='flex-grow-1']//parent::div//button[1]")
    @CacheLookup
    WebElement ANNEX_ADD_BTN;

/*    @FindBy(xpath = "//*[text()='Annexes']//ancestor::div[@class='flex-grow-1']//parent::div//button[2]")
    @CacheLookup
    WebElement ANNEX_REORDER_BTN;*/

    By deleteButton = By.cssSelector("button.eui-list-item--danger");
    By downloadButton = By.xpath("//button//*[contains(text(),'Download')]");
    By changeTitleButton = By.xpath("//button//*[contains(text(),'Change title')]");
    By annexFound = By.xpath("//*[contains(text(),'annexes found')]");
    String tab = "div.eui-tab-item:nth-child(%d)";
    String annexTitle = "//table//tbody//tr[%d]//td//a";

    public ProposalViewerPage(WebDriver driver) {
        super(driver);
        this.driver = driver;
        waitForLoadingProgressBarToDisappear(driver);
        AjaxElementLocatorFactory ajax = new AjaxElementLocatorFactory(driver, Constants.TIMEOUT_DELAY);
        PageFactory.initElements(ajax, this);
    }

    public String getProposalTitle() {
        return PROPOSAL_TITLE.getText();
    }

    public boolean isCloseButtonDisplayed() {
        return CLOSE_BTN.isDisplayed();
    }

    public boolean isCloseButtonEnabled() {
        return CLOSE_BTN.isEnabled();
    }

    public void clickOnActionButton() {
        elementClick(driver, ACTIONS_BTN);
    }

    public void clickDownloadButton() {
        elementClick(driver, driver.findElement(downloadButton));
    }

    public void clickOnDeleteButton() {
        driver.findElement(deleteButton).click();
    }

    public void clickOnCloseButton() {
        elementClick(driver, CLOSE_BTN);
    }

    public String getTabName(int tabIndex) {
        return getElementText(driver.findElement(By.cssSelector(String.format(tab, tabIndex))));
    }

    public String getActiveTabName() {
        return getElementText(ACTIVE_TAB);
    }

    public int getNumberOfAnnexes() {
        return Integer.parseInt(String.valueOf(getElementText(driver.findElement(annexFound)).charAt(0)));
    }

    public String getAnnexTitle(int annexIndex) {
        return getElementText(driver.findElement(By.xpath(String.format(annexTitle, annexIndex))));
    }

    public boolean isCoverPageSectionDisplayed() {
        return waitForElementTobeDisPlayed(driver, COVER_PAGE);
    }

    public boolean isExpMemoSectionDisplayed() {
        return waitForElementTobeDisPlayed(driver, EXP_MEMO);
    }

    public boolean isLegalActSectionDisplayed() {
        return waitForElementTobeDisPlayed(driver, LEGAL_ACT);
    }

    public boolean isFinanceStatementSectionDisplayed() {
        return waitForElementTobeDisPlayed(driver, FINANCE_STATEMENT);
    }

    public boolean isAnnexesSectionDisplayed() {
        return waitForElementTobeDisPlayed(driver, ANNEXES);
    }

    public boolean contentDisplayedUnderFinancialStatement(String content) {
        return waitForElementTobeDisPlayed(driver, getWebElementByText(content));
    }

    public boolean contentDisplayedUnderFAnnexesSection(String content) {
        return waitForElementTobeDisPlayed(driver, getWebElementByText(content));
    }

    public WebElement getWebElementByText(String text) {
        return driver.findElement(By.xpath("//*[contains(text(),'" + text + "')]"));
    }

    public void clickAnnexAddButton() {
        elementClick(driver, ANNEX_ADD_BTN);
        waitForLoadingProgressBarToDisappear(driver);
    }

    public void clickChangeTitleButton() {
        elementClick(driver, driver.findElement(changeTitleButton));
    }

    public void clickMileStonesTab() {
        MILESTONES_TAB.click();
    }

    public void clickOnCoverPageLInk() {
        COVER_PAGE.click();
    }
}
