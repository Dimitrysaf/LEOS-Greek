package europa.edit.stepdef;

import europa.edit.pages.OverViewPage;
import europa.edit.util.BaseDriver;
import europa.edit.util.WebDriverFactory;
import io.cucumber.java.en.And;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;

import static org.testng.Assert.assertEquals;
import static org.testng.Assert.assertTrue;


public class OverViewPageSteps extends BaseDriver {

    private OverViewPage overViewPage;

    @Then("user is on overview screen")
    public void userIsOnOverviewScreen() {
        overViewPage = new OverViewPage(WebDriverFactory.getDriver());
        assertEquals(overViewPage.getEUILabelText(), "Proposal View");
    }

    @Then("share button is displayed and enabled")
    public void shareButtonIsDisplayedAndEnabled() {
        assertTrue(overViewPage.isShareBtnDisplayedAndEnabled());
    }

    @And("delete button is not displayed")
    public void deleteButtonIsNotDisplayed() {
        assertTrue(overViewPage.isDeleteBtnNotPresent());
    }

    @And("download button is not displayed")
    public void downloadButtonIsNotDisplayed() {
        assertTrue(overViewPage.isDownloadBtnNotPresent());
    }

    @When("click on actions button present in overview screen")
    public void clickOnActionsButtonPresentInProposalViewerScreen() {
        overViewPage.clickOnActionButton();
    }

    @When("click on delete button present in overview screen")
    public void clickOnDeleteButtonPresentInOverviewScreen() {
        overViewPage.clickOnDeleteButton();
    }

    @And("export as pdf button is displayed and enabled")
    public void exportAsPdfButtonIsDisplayedAndEnabled() {
        assertTrue(overViewPage.isExportAsPdfBtnDisplayedAndEnabled());
    }
}