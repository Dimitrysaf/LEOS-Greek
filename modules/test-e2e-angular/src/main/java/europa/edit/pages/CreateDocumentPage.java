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

public class CreateDocumentPage {

    private final WebDriver driver;

    @FindBy(xpath = "//*[text()='Create new legislative document']")
    @CacheLookup
    WebElement createDocumentTitle;

    @FindBy(css = ".app-dialog-footer-content .eui-button:nth-child(1)")
    @CacheLookup
    WebElement cancelBtn;

    @FindBy(css = ".app-dialog-footer-content .eui-button:nth-child(2)")
    @CacheLookup
    WebElement previousBtn;

    @FindBy(css = ".app-dialog-footer-content .eui-button:nth-child(3)")
    @CacheLookup
    WebElement nextBtn;

    @FindBy(css = ".app-dialog-footer-content .eui-button:nth-child(4)")
    @CacheLookup
    WebElement createBtn;

    @FindBy(id = "docPurpose")
    @CacheLookup
    WebElement documentTitle;

    public CreateDocumentPage(WebDriver driver) {
        this.driver = driver;
        waitForLoadingProgressBarToDisappear(driver);
        AjaxElementLocatorFactory ajax = new AjaxElementLocatorFactory(driver, Constants.TIMEOUT_DELAY);
        PageFactory.initElements(ajax, this);
    }

    public boolean isCreateDocumentTitleDisplayed() {
        return createDocumentTitle.isDisplayed();
    }

    public void clickOnSpecificTemplate(String arg0) {
        elementClick(driver, waitForElementTobePresent(driver, By.xpath("//li[@title='Interinstitutional procedures - Law Initiative (COM/JOIN)']//span[contains(text(),'" + arg0 + "')]")));
    }

    public void clickOnNextButton() {
        nextBtn.click();
    }

    public boolean isSelectDocumentTypeAndLanguageDisplayed(String label) {
        return waitForElementTobeDisPlayed(driver, waitForElementTobePresent(driver, By.xpath("//*[contains(text(), '" + label + "')]")));
    }

    public void clickOnPreviousButton() {
        previousBtn.click();
    }

    public void clickOnCancelButton() {
        cancelBtn.click();
    }

    public boolean isPreviousButtonEnabled() {
        return previousBtn.isEnabled();
    }

    public boolean isNextButtonEnabled() {
        return waitForElementTobeClickable(driver, nextBtn).isEnabled();
    }

    public void enterDocumentTitle(String arg0) {
        documentTitle.clear();
        documentTitle.sendKeys(arg0);
    }

    public void clickOnCreateButton() {
        createBtn.click();
    }
}
