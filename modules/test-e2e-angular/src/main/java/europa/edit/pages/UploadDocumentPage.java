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

public class UploadDocumentPage {

    private final WebDriver driver;

    @FindBy(xpath = "//*[text()='Upload new legislative document']")
    @CacheLookup
    WebElement uploadDocumentTitle;

    @FindBy(xpath = "//*[text()='Please select a leg file to be uploaded:']")
    @CacheLookup
    WebElement selectLegFileLabel;

    @FindBy(xpath = "//*[text()=' Enter document metadata ']")
    @CacheLookup
    WebElement enterDocumentMetaDataLabel;

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

    public UploadDocumentPage(WebDriver driver) {
        this.driver = driver;
        waitForLoadingProgressBarToDisappear(driver);
        AjaxElementLocatorFactory ajax = new AjaxElementLocatorFactory(driver, Constants.TIMEOUT_DELAY);
        PageFactory.initElements(ajax, this);
    }

    public void uploadRecentFile(String fileType, String relativeLocation) {
        File file = findRecentFile(fileType, relativeLocation);
        ((RemoteWebDriver) driver).setFileDetector(new LocalFileDetector());
        assert file != null;
        elementSendKeys(driver, fileInput, file.getAbsolutePath());
    }

    public boolean isUploadWindowDisplayed() {
        return waitForElementTobeDisPlayed(driver,uploadDocumentTitle);
    }

    public boolean isSelectLegFileLabelDisplayed() {
        return waitForElementTobeDisPlayed(driver, selectLegFileLabel);
    }

    public boolean isEnterDocumentMetaDataLabelDisplayed() {
        return waitForElementTobeDisPlayed(driver, enterDocumentMetaDataLabel);
    }

    public void enterDocumentTitle(String title) {
        documentTitle.clear();
        documentTitle.sendKeys(title);
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
}
