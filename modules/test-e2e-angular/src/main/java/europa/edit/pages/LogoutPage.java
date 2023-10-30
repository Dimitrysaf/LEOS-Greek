package europa.edit.pages;


import europa.edit.util.Constants;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.CacheLookup;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.pagefactory.AjaxElementLocatorFactory;

import static europa.edit.util.E2eUtil.waitForPageLoad;

public class LogoutPage {

    private final WebDriver driver;

    @FindBy(xpath = "//h1[text()='Logout']")
    @CacheLookup
    WebElement LOG_OUT_MESSAGE;

    @FindBy(css = ".informationMessage")
    @CacheLookup
    WebElement INFORMATION_MESSAGE;

    @FindBy(css = "li a[href*='login']")
    @CacheLookup
    WebElement LOGIN_LINK;

    public LogoutPage(WebDriver driver) {
        this.driver = driver;
        waitForPageLoad(driver, Constants.TIMEOUT_DELAY);
        AjaxElementLocatorFactory ajax=new AjaxElementLocatorFactory(driver, Constants.TIMEOUT_DELAY);
        PageFactory.initElements(ajax, this);
    }
}
