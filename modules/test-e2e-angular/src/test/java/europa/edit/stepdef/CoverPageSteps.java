package europa.edit.stepdef;

import europa.edit.pages.CoverPage;
import europa.edit.util.BaseDriver;
import europa.edit.util.WebDriverFactory;
import io.cucumber.java.en.Then;

import static org.testng.Assert.assertEquals;


public class CoverPageSteps extends BaseDriver {

    private CoverPage coverPage;

    @Then("user is on cover page")
    public void userIsOnOverviewScreen() {
        coverPage = new CoverPage(WebDriverFactory.getDriver());
        assertEquals(coverPage.getEUILabelText(), "Cover Page");
    }

}