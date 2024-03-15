package europa.edit.stepdef;

import europa.edit.pages.UploadDocumentPage;
import europa.edit.util.BaseDriver;
import europa.edit.util.WebDriverFactory;
import io.cucumber.java.en.And;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;

import static org.testng.Assert.assertEquals;
import static org.testng.Assert.assertTrue;

public class UploadDocumentPageSteps extends BaseDriver {

    private UploadDocumentPage uploadDocumentPage;

    @Then("user is on upload new legislative document window")
    public void userIsOnUploadNewLegislativeDocumentWindow() {
        uploadDocumentPage = new UploadDocumentPage(WebDriverFactory.getDriver());
        assertTrue(uploadDocumentPage.isUploadWindowDisplayed());
    }

    @And("{string} is showing as document language")
    public void isShowingAsDocumentLanguage(String lang) {
        assertEquals(lang, uploadDocumentPage.getDocumentLanguage());
    }

    @And("{string} is showing as confidentiality level")
    public void isShowingAsConfidentialityLevel(String confidentialityLevel) {
        assertEquals(confidentialityLevel, uploadDocumentPage.getDocumentConfidentialityLevel());
    }

    @When("provide document title {string} in upload document page")
    public void provideDocumentTitleInUploadDocumentPage(String title) {
        uploadDocumentPage.enterDocumentTitle(title);
    }

    @When("upload a recent {string} file from relative location {string}")
    public void uploadARecentFileFromRelativeLocation(String fileType, String relativeLocation) {
        uploadDocumentPage.uploadRecentFile(fileType, relativeLocation);
    }

    @And("please select a leg file to be uploaded label is displayed in upload document page")
    public void pleaseSelectALegFileToBeUploadedLabelIsDisplayedInUploadDocumentPage() {
        assertTrue(uploadDocumentPage.isSelectLegFileLabelDisplayed());
    }

    @Then("enter document metadata label is displayed in upload document page")
    public void enterDocumentMetadataLabelIsDisplayedInUploadDocumentPage() {
        assertTrue(uploadDocumentPage.isEnterDocumentMetaDataLabelDisplayed());
    }

    @And("click on create button in upload document page")
    public void clickOnCreateButtonInUploadDocumentPage() {
        uploadDocumentPage.clickOnCreateButton();
    }

    @When("upload a leg file from relative location {string}")
    public void uploadALegFileFromRelativeLocation(String relativeLocation) {
        uploadDocumentPage.uploadFile(relativeLocation);
    }
}