package europa.edit.stepdef;

import europa.edit.pages.OverViewPage;
import europa.edit.util.BaseDriver;
import europa.edit.util.WebDriverFactory;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;

import static org.testng.Assert.assertEquals;


public class OverViewPageSteps extends BaseDriver {

    private OverViewPage overViewPage;

    @Then("user is on overview screen")
    public void userIsOnOverviewScreen() {
        overViewPage = new OverViewPage(WebDriverFactory.getDriver());
        assertEquals(overViewPage.getEUILabelText(), "Proposal View");
    }

    @When("click on home link present in breadcrumb")
    public void clickOnHomeLinkPresentInBreadcrumb() {
        overViewPage.clickHomeButton();
    }
}