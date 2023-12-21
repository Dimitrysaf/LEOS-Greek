package europa.edit.pages;

import europa.edit.util.Constants;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.CacheLookup;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.pagefactory.AjaxElementLocatorFactory;

import static europa.edit.util.E2eUtil.*;

public class DialogBoxPage {

    private final WebDriver driver;

    @FindBy(css = "div>eui-dialog-header")
    @CacheLookup
    WebElement HEADER;

/*    @FindBy(css = "div.eui-dialog__body-content")
    @CacheLookup
    WebElement BODY_CONTENT;*/

    @FindBy(css = "eui-dialog-footer button.eui-button--secondary")
    @CacheLookup
    WebElement SECONDARY_BUTTON;

    @FindBy(css = "eui-dialog-footer button.eui-button--danger")
    @CacheLookup
    WebElement DANGER_BUTTON;

    public DialogBoxPage(WebDriver driver) {
        this.driver = driver;
        waitForLoadingProgressBarToDisappear(driver);
        AjaxElementLocatorFactory ajax=new AjaxElementLocatorFactory(driver, Constants.TIMEOUT_DELAY);
        PageFactory.initElements(ajax, this);
    }

    public void clickOnDangerButton() {
        elementClick(driver, DANGER_BUTTON);
        waitForLoadingProgressBarToDisappear(driver);
    }

    public String getHeaderTitle() {
        return HEADER.getText();
    }

    public boolean isCancelButtonDisplayed() {
        return SECONDARY_BUTTON.isDisplayed();
    }

    public boolean isCancelButtonEnabled() {
        return SECONDARY_BUTTON.isEnabled();
    }

    public boolean isDeleteButtonDisplayed() {
        return DANGER_BUTTON.isDisplayed();
    }

    public boolean isDeleteButtonEnabled() {
        return DANGER_BUTTON.isEnabled();
    }
}
