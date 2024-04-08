package europa.edit.stepdef;

import europa.edit.pages.CoverPage;
import europa.edit.pages.ExplanatoryMemorandumPage;
import europa.edit.util.BaseDriver;
import europa.edit.util.WebDriverFactory;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;

import static org.testng.Assert.assertEquals;


public class ExplanatoryMemorandumPageSteps extends BaseDriver {

    private ExplanatoryMemorandumPage explanatoryMemorandumPage;

    @Then("explanatory memorandum page is displayed")
    public void explanatoryMemorandumPageIsDisplayed() {
        explanatoryMemorandumPage = new ExplanatoryMemorandumPage(WebDriverFactory.getDriver());
        assertEquals(explanatoryMemorandumPage.getEUILabelText(), "Explanatory Memorandum");
    }

    @When("click on close button in explanatory memorandum page")
    public void clickOnCloseButtonInExplanatoryMemorandumPage() {
    }
}