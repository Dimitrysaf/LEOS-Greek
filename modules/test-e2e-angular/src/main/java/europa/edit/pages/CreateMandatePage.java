package europa.edit.pages;

import europa.edit.util.Constants;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.remote.LocalFileDetector;
import org.openqa.selenium.remote.RemoteWebDriver;
import org.openqa.selenium.support.CacheLookup;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.pagefactory.AjaxElementLocatorFactory;

import java.io.File;

import static europa.edit.util.E2eUtil.*;

public class CreateMandatePage {

    private final WebDriver driver;

    @FindBy(xpath = "//*[text()='Create new mandate']")
    @CacheLookup
    WebElement CREATE_MANDATE;

    @FindBy(xpath = "//*[text()='Please select a leg file to be uploaded:']")
    @CacheLookup
    WebElement selectLegFileLabel;

    @FindBy(xpath = "//*[text()=' Enter draft metadata ']")
    @CacheLookup
    WebElement enterDraftMetaDataLabel;

    @FindBy(css = "input.file-input")
    @CacheLookup
    WebElement fileInput;

    @FindBy(id = "docPurpose")
    @CacheLookup
    WebElement documentTitle;

    @FindBy(css = "input#document-language")
    @CacheLookup
    WebElement documentLanguage;

    @FindBy(css = "input#confidentiality-level")
    @CacheLookup
    WebElement documentConfidentialityLevel;

    @FindBy(css = ".app-dialog-footer-content .eui-button:nth-child(4)")
    @CacheLookup
    WebElement createBtn;

    public CreateMandatePage(WebDriver driver) {
        this.driver = driver;
        waitForLoadingProgressBarToDisappear(driver);
        AjaxElementLocatorFactory ajax = new AjaxElementLocatorFactory(driver, Constants.TIMEOUT_DELAY);
        PageFactory.initElements(ajax, this);
    }

    public boolean isSelectLegFileLabelDisplayed() {
        return waitForElementTobeDisPlayed(driver, selectLegFileLabel);
    }

    public String getDocumentLanguage() {
        return getElementAttributeValue(documentLanguage);
    }

    public String getDocumentConfidentialityLevel() {
        return getElementAttributeValue(documentConfidentialityLevel);
    }

    public void clickOnCreateButton() {
        createBtn.click();
    }

    public void uploadFile(String relativeLocation) {
        File file = new File(System.getProperty("user.dir") + relativeLocation);
        ((RemoteWebDriver) driver).setFileDetector(new LocalFileDetector());
        elementSendKeys(driver, fileInput, file.getAbsolutePath());
    }

    public boolean isEnterDraftMetaDataLabelDisplayed() {
        return waitForElementTobeDisPlayed(driver, enterDraftMetaDataLabel);
    }

    public String getDraftTitle() {
        return getElementAttributeValue(documentTitle);
    }

    public boolean isCreateMandateWindowDisplayed() {
        return CREATE_MANDATE.isDisplayed();
    }
}
