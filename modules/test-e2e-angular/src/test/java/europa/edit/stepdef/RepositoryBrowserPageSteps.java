package europa.edit.stepdef;

import europa.edit.pages.RepositoryBrowserPage;
import europa.edit.util.BaseDriver;
import europa.edit.util.WebDriverFactory;
import io.cucumber.java.en.And;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import static org.testng.Assert.*;

public class RepositoryBrowserPageSteps extends BaseDriver {

    private RepositoryBrowserPage repositoryBrowserPage;

    @Then("user is on repository browser page")
    public void userIsOnRepositoryBrowserPage() {
        repositoryBrowserPage = new RepositoryBrowserPage(WebDriverFactory.getDriver());
        assertTrue(repositoryBrowserPage.isFilterContainerDisplayed());
        assertTrue(repositoryBrowserPage.isResultTextDisplayed());
        assertTrue(repositoryBrowserPage.isSortButtonDisplayed());
    }

    @And("upload button is not present")
    public void uploadButtonIsNotPresentInRepositoryBrowserPage() {
        assertTrue(repositoryBrowserPage.isUploadBtnNotPresent());
    }

    @And("upload button is present")
    public void uploadButtonIsPresentInRepositoryBrowserPage() {
        assertTrue(repositoryBrowserPage.isUploadBtnPresent());
    }

    @And("create mandate button is displayed and enabled")
    public void createMandateButtonIsDisplayedAndEnabled() {
        assertTrue(repositoryBrowserPage.isCreateMandateBtnDisplayedAndEnabled());
    }

    @And("create draft button is displayed and enabled")
    public void createDraftButtonIsDisplayedAndEnabled() {
        assertTrue(repositoryBrowserPage.isCreateDraftBtnDisplayedAndEnabled());
    }

    @And("proposals list is displayed")
    public void proposalsListIsDisplayed() {
        assertTrue(repositoryBrowserPage.isProposalListDisplayed());
    }

    @When("click on proposal {int}")
    public void clickOnProposal(int arg0) {
        repositoryBrowserPage.clickOnNthProposal(arg0);
    }

    @And("create proposal button is present")
    public void createProposalButtonIsDisplayed() {
        assertTrue(repositoryBrowserPage.isCreateProposalBtnDisplayed());
    }
}