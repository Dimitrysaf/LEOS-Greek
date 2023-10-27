package europa.edit.stepdef;

import europa.edit.pages.HeaderPage;
import europa.edit.util.BaseDriver;
import europa.edit.util.WebDriverFactory;
import io.cucumber.java.en.And;
import static org.testng.Assert.assertTrue;

public class HeaderPageSteps extends BaseDriver {

    @And("user name is present in the top right upper corner")
    public void userNameIsPresentInTheTopRightUpperCorner() {
        HeaderPage headerPage = new HeaderPage(WebDriverFactory.getDriver());
        assertTrue(headerPage.isUserNamePresent());
    }
}