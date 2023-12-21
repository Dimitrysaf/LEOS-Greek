package europa.edit.pages;

import europa.edit.util.Constants;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.CacheLookup;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.pagefactory.AjaxElementLocatorFactory;

import static europa.edit.util.E2eUtil.*;

public class ChangeTitlePage {

    private final WebDriver driver;

    @FindBy(css = "div .eui-dialog__header-title")
    @CacheLookup
    WebElement HEADER_TITLE;

    @FindBy(css = "input.eui-input-text")
    @CacheLookup
    WebElement INPUT_TEXT;

    @FindBy(css = ".save-button.eui-button--primary")
    @CacheLookup
    WebElement PRIMARY_BUTTON;

    @FindBy(css = "eui-dialog-footer button.eui-button--secondary")
    @CacheLookup
    WebElement SECONDARY_BUTTON;

    public ChangeTitlePage(WebDriver driver) {
        this.driver = driver;
        waitForLoadingProgressBarToDisappear(driver);
        AjaxElementLocatorFactory ajax=new AjaxElementLocatorFactory(driver, Constants.TIMEOUT_DELAY);
        PageFactory.initElements(ajax, this);
    }

/*    public void enterProposalTitle(String newTitle) {
        INPUT_TEXT.clear();
        INPUT_TEXT.sendKeys(newTitle);
    }*/

    public String getHeaderTitle() {
        return HEADER_TITLE.getText();
    }

    public boolean isSaveButtonDisplayed() {
        return PRIMARY_BUTTON.isDisplayed();
    }

    public boolean isSaveButtonEnabled() {
        return PRIMARY_BUTTON.isEnabled();
    }

    public boolean isCancelButtonDisplayed() {
        return SECONDARY_BUTTON.isDisplayed();
    }

    public boolean isCancelButtonEnabled() {
        return SECONDARY_BUTTON.isEnabled();
    }

    public void appendNewTitle(String newTitle) {
        String title = getElementAttributeValue(INPUT_TEXT);
        INPUT_TEXT.clear();
        INPUT_TEXT.sendKeys(title.concat(newTitle));
    }

    public void clickSaveButton() {
        PRIMARY_BUTTON.click();
    }
}
