package europa.edit.stepdef;

import europa.edit.pages.CreateMandatePage;
import europa.edit.util.BaseDriver;
import europa.edit.util.WebDriverFactory;
import io.cucumber.java.en.And;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;

import static org.testng.Assert.assertEquals;
import static org.testng.Assert.assertTrue;

public class CreateMandatePageSteps extends BaseDriver {

    private CreateMandatePage createMandatePage;

    @Then("user is on create new mandate window")
    public void userIsOnCreateNewMandateWindow() {
        createMandatePage = new CreateMandatePage(WebDriverFactory.getDriver());
        assertTrue(createMandatePage.isCreateMandateWindowDisplayed());
    }

    @And("please select a leg file to be uploaded label is displayed in create mandate window")
    public void pleaseSelectALegFileToBeUploadedLabelIsDisplayedInCreateMandateWindow() {
        assertTrue(createMandatePage.isSelectLegFileLabelDisplayed());
    }

    @When("upload a leg file from relative location {string} in create mandate window")
    public void uploadALegFileFromRelativeLocationInCreateMandateWindow(String relativeLocation) {
        createMandatePage.uploadFile(relativeLocation);
    }

    @Then("enter draft metadata label is displayed in create mandate window")
    public void enterDraftMetadataLabelIsDisplayedInCreateMandateWindow() {
        assertTrue(createMandatePage.isEnterDraftMetaDataLabelDisplayed());
    }

    @And("{string} is showing as draft title in create mandate window")
    public void isShowingAsDraftTitleInCreateMandateWindow(String title) {
        assertEquals(title, createMandatePage.getDraftTitle());
    }

    @And("{string} is showing as draft language in create mandate window")
    public void isShowingAsDraftLanguageInCreateMandateWindow(String lang) {
        assertEquals(lang, createMandatePage.getDocumentLanguage());
    }

    @And("{string} is showing as confidentiality level in create mandate window")
    public void isShowingAsConfidentialityLevelInCreateMandateWindow(String confidentialityLevel) {
        assertEquals(confidentialityLevel, createMandatePage.getDocumentConfidentialityLevel());
    }

    @When("click on create button in create mandate window")
    public void clickOnCreateButtonInCreateMandateWindow() {
        createMandatePage.clickOnCreateButton();
    }
}