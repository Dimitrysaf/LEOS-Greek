package europa.edit.pages;

import europa.edit.util.Constants;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.CacheLookup;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;

import static europa.edit.util.E2eUtil.*;

public class EULoginPage {

    private final WebDriver driver;

    @FindBy(id = "username")
    @CacheLookup
    WebElement uniqueID;

    @FindBy(name = "whoamiSubmit")
    @CacheLookup
    WebElement next_btn;

    public EULoginPage(WebDriver driver) {
        this.driver = driver;
        waitForPageLoad(driver, Constants.TIMEOUT_DELAY);
        PageFactory.initElements(driver, this);
    }

    public void enterUserName(String username) {
        elementSendKeys(driver, uniqueID, username);
    }

    public void clickNext() {
        elementClick(driver, next_btn);
    }

    public String getTitle() {
        return driver.getTitle();
    }
}
