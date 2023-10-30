package europa.edit.stepdef;

import europa.edit.pages.EULoginPage;
import europa.edit.util.BaseDriver;
import europa.edit.util.WebDriverFactory;
import io.cucumber.java.en.And;
import io.cucumber.java.en.Given;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import org.openqa.selenium.WebDriver;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import static org.testng.Assert.*;


public class EULoginPageSteps extends BaseDriver {

    private static final Logger logger = LoggerFactory.getLogger(EULoginPageSteps.class);
    private EULoginPage euLoginPage;

    @Given("^navigate to \"([^\"]*)\" application$")
    public void invokeApp(String appType) {
        startApp(WebDriverFactory.getDriver(), appType);
    }

    @Then("user is on EU login page")
    public void userIsOnEuLoginPage() {
        euLoginPage = new EULoginPage(WebDriverFactory.getDriver());
        String title = euLoginPage.getTitle();
        assertEquals(title, "EU Login");
    }

    @When("user enters username {string}")
    public void userEntersUsername(String name) {
        String userName = config.getProperty(name);
        euLoginPage.enterUserName(userName);
    }

    @And("user clicks next button")
    public void userClicksNextButton() {
        euLoginPage.clickNext();
    }

    public void startApp(WebDriver driver, String applicationType) {
        String applicationURL = getAppUrl(applicationType);
        if (!driver.getCurrentUrl().trim().contains(applicationURL)) {
            driver.get(applicationURL);
        }
    }

    private String getAppUrl(String applicationType) {
        String appUrl = "";
        if (applicationType.equalsIgnoreCase("Drafting")) {
            appUrl = config.getProperty("edit.drafting.appUrl");
        }
        if (applicationType.equalsIgnoreCase("Revision")) {
            appUrl = config.getProperty("edit.revision.appUrl");
        }
        logger.info("Open application {} url {}", applicationType, appUrl);
        return appUrl;
    }
}