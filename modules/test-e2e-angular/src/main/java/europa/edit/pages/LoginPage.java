package europa.edit.pages;

import europa.edit.util.Constants;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.CacheLookup;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.pagefactory.AjaxElementLocatorFactory;

import static europa.edit.util.E2eUtil.*;

public class LoginPage {

    private final WebDriver driver;

    @FindBy(name = "_submit")
    @CacheLookup
    WebElement SIGN_IN_BTN;

    @FindBy(id = "password")
    @CacheLookup
    WebElement PASSWORD_INPUT_TEXT_BOX;

/*    @FindBy(css = ".user-logout-link")
    @CacheLookup
    WebElement USER_LOGOUT_LINK;*/

    public LoginPage(WebDriver driver) {
        this.driver = driver;
        waitForPageLoad(driver, Constants.TIMEOUT_DELAY);
        AjaxElementLocatorFactory ajax=new AjaxElementLocatorFactory(driver, Constants.TIMEOUT_DELAY);
        PageFactory.initElements(ajax, this);
    }

    public String getTitle() {
        return driver.getTitle();
    }

    public void enterPassword(String password) {
        elementSendKeys(driver, PASSWORD_INPUT_TEXT_BOX, password);
    }

    public void clickSignIn() {
        elementClick(driver, SIGN_IN_BTN);
    }
}
