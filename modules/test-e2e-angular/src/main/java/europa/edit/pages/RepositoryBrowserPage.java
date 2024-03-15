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

public class RepositoryBrowserPage extends HeaderPage {

    private final WebDriver driver;

    @FindBy(css = "div.filters-container")
    @CacheLookup
    WebElement FILTERS_CONTAINER;

    @FindBy(xpath = "//*[text()='Sort']")
    @CacheLookup
    WebElement SORT_BTN;

    @FindBy(xpath = "//*[contains(text(),'Results')]")
    @CacheLookup
    WebElement RESULTS_TXT;

    public RepositoryBrowserPage(WebDriver driver) {
        super(driver);
        this.driver = driver;
        waitForLoadingProgressBarToDisappear(driver);
        AjaxElementLocatorFactory ajax = new AjaxElementLocatorFactory(driver, Constants.TIMEOUT_DELAY);
        PageFactory.initElements(ajax, this);
    }

    By UPLOAD_BTN = By.xpath("//*[contains(text(),'Upload')]");
    By CREATE_PROPOSAL_BTN = By.xpath("//*[contains(text(),'Create Proposal')]");
    By PROPOSAL_LIST_LINK = By.cssSelector("app-proposals-list app-proposal-item a");
    By CREATE_MANDATE_BTN = By.xpath("//*[contains(text(),'Create mandate')]");
    By CREATE_DRAFT_BTN = By.xpath("//*[contains(text(),'Create Draft')]");

    public boolean isCreateProposalBtnDisplayedAndEnabled() {
        return isElementDisplayedAndEnabled(driver.findElement(CREATE_PROPOSAL_BTN));
    }

    public boolean isUploadBtnNotPresent() {
        return waitUnTillElementIsNotPresent(driver, UPLOAD_BTN);
    }

    public boolean isFilterContainerDisplayed() {
        return waitForElementTobeDisPlayed(driver, FILTERS_CONTAINER);
    }

    public boolean isResultTextDisplayed() {
        return waitForElementTobeDisPlayed(driver, RESULTS_TXT);
    }

    public boolean isSortButtonDisplayed() {
        return waitForElementTobeDisPlayed(driver, SORT_BTN);
    }

    public boolean isUploadBtnIsDisplayedAndEnabled() {
        return isElementDisplayedAndEnabled(driver.findElement(UPLOAD_BTN));
    }

    public void clickOnNthProposal(int arg0) {
        elementClick(driver, driver.findElements(PROPOSAL_LIST_LINK).get(arg0 - 1));
    }

    public boolean isCreateMandateBtnDisplayedAndEnabled() {
        return isElementDisplayedAndEnabled(driver.findElement(CREATE_MANDATE_BTN));
    }

    public boolean isCreateDraftBtnDisplayedAndEnabled() {
        return isElementDisplayedAndEnabled(driver.findElement(CREATE_DRAFT_BTN));
    }

    public boolean isProposalListDisplayed() {
        return waitForElementTobeDisPlayed(driver, driver.findElement(PROPOSAL_LIST_LINK));
    }

    public void clickCreateProposalButton() {
        elementClick(driver, driver.findElement(CREATE_PROPOSAL_BTN));
    }

    public void clickUploadButton() {
        elementClick(driver, driver.findElement(UPLOAD_BTN));
    }

    public void clickCreateMandateButton() {
        elementClick(driver, driver.findElement(CREATE_MANDATE_BTN));
    }
}
