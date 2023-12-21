package europa.edit.stepdef;

import europa.edit.pages.CreateDocumentPage;
import europa.edit.util.BaseDriver;
import europa.edit.util.WebDriverFactory;
import io.cucumber.java.en.And;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;

import static org.testng.Assert.*;

public class CreateDocumentPageSteps extends BaseDriver {

    private CreateDocumentPage createDocumentPage;

    @Then("user is on create new legislative document window")
    public void userIsCreateNewLegislativeDocumentWindow() {
        createDocumentPage = new CreateDocumentPage(WebDriverFactory.getDriver());
        assertTrue(createDocumentPage.isCreateDocumentTitleDisplayed());

    }

    @When("click on template {string} under tree item")
    public void clickOnTemplateUnderTreeItemInterinstitutionalProceduresLawInitiativeCOMJOIN(String arg0) {
        createDocumentPage.clickOnSpecificTemplate(arg0);
    }

    @When("click on next button in create document page")
    public void clickOnNextButtonInCreateDocumentPage() {
        createDocumentPage.clickOnNextButton();
    }

    @Then("{string} label is displayed in create document page")
    public void labelIsDisplayedInCreateDocumentPage(String arg0) {
        assertTrue(createDocumentPage.isSelectDocumentTypeAndLanguageDisplayed(arg0));
    }

    @When("click on previous button in create document page")
    public void clickOnPreviousButtonInCreateDocumentPage() {
        createDocumentPage.clickOnPreviousButton();
    }

    @When("click on cancel button in create document page")
    public void clickOnCancelButtonInCreateDocumentPage() {
        createDocumentPage.clickOnCancelButton();
    }

    @And("previous button is disabled")
    public void previousButtonIsDisabled() {
        assertFalse(createDocumentPage.isPreviousButtonEnabled());
    }

    @Then("next button is enabled")
    public void nextButtonIsEnabled() {
        assertTrue(createDocumentPage.isNextButtonEnabled());
    }

    @And("previous button is enabled")
    public void previousButtonIsEnabled() {
        assertTrue(createDocumentPage.isPreviousButtonEnabled());
    }

    @When("provide document title {string} in create document page")
    public void provideDocumentTitleInCreateDocumentPage(String arg0) {
        createDocumentPage.enterDocumentTitle(arg0);
    }


    @And("click on create button")
    public void clickOnCreateButton() {
        createDocumentPage.clickOnCreateButton();
    }
}