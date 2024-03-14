package europa.edit.stepdef;

import europa.edit.pages.HomePage;
import europa.edit.util.BaseDriver;
import europa.edit.util.WebDriverFactory;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;

import static org.testng.Assert.assertTrue;

public class HomePageSteps extends BaseDriver {

    private HomePage homePage;

    @Then("user is on home page")
    public void userIsOnHomePage() {
        homePage = new HomePage(WebDriverFactory.getDriver());
        assertTrue(homePage.isTextDisplayed());
        assertTrue(homePage.isViewAllActsButtonDisplayedAndEnabled());
        assertTrue(homePage.isSearchForProposalInputDisplayedAndEnabled());
        assertTrue(homePage.isMyLatestActivitySectionDisplayed());
        assertTrue(homePage.isMyFavouritesSectionDisplayed());
    }

    @When("user clicks on view all acts button")
    public void userClicksOnViewAllActsButton() {
        homePage.clickViewAllActsButton();
    }
}