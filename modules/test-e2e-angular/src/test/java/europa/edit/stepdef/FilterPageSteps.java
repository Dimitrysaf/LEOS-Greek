package europa.edit.stepdef;

import europa.edit.pages.FilterPage;
import europa.edit.util.BaseDriver;
import europa.edit.util.WebDriverFactory;
import io.cucumber.datatable.DataTable;
import io.cucumber.java.en.And;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;

import java.util.ArrayList;
import java.util.List;

import static org.testng.Assert.assertFalse;
import static org.testng.Assert.assertTrue;

public class FilterPageSteps extends BaseDriver {

    private FilterPage filterPage;

    @And("filter section is displayed")
    public void filterSectionIsDisplayed() {
        filterPage = new FilterPage(WebDriverFactory.getDriver());
        assertTrue(filterPage.isFilterSectionDisplayed());
    }

    @And("search text box is present in filter section")
    public void searchTextBoxIsPresentInFilterSection() {
        assertTrue(filterPage.isSearchTextBoxDisplayed());
    }

    @And("search button is present in filter section")
    public void searchButtonIsPresentInFilterSection() {
        assertTrue(filterPage.isSearchButtonDisplayedAndEnabled());
    }

    @And("reset button is present in filter section")
    public void resetButtonIsPresentInFilterSection() {
        assertTrue(filterPage.isResetButtonDisplayedAndEnabled());
    }

    @And("below procedures are present in filter section")
    public void belowProceduresArePresentInFilterSection(DataTable dataTable) {
        List<String> givenProceduresList = dataTable.asList(String.class);
        List<String> actualProceduresList = new ArrayList<>();
        actualProceduresList = filterPage.getProceduresList(actualProceduresList);
        assertTrue(actualProceduresList.containsAll(givenProceduresList));
    }

    @And("below acts are present in filter section")
    public void belowActsArePresentInFilterSection(DataTable dataTable) {
        List<String> givenProceduresList = dataTable.asList(String.class);
        List<String> actualProceduresList = new ArrayList<>();
        actualProceduresList = filterPage.getActsList(actualProceduresList);
        assertTrue(actualProceduresList.containsAll(givenProceduresList));
    }

    @And("below templates are present in filter section")
    public void belowTemplatesArePresentInFilterSection(DataTable dataTable) {
        List<String> givenProceduresList = dataTable.asList(String.class);
        List<String> actualProceduresList = new ArrayList<>();
        actualProceduresList = filterPage.getTemplatesList(actualProceduresList);
        assertTrue(actualProceduresList.containsAll(givenProceduresList));
    }

    @And("below role are present in filter section")
    public void belowRoleArePresentInFilterSection(DataTable dataTable) {
        List<String> givenProceduresList = dataTable.asList(String.class);
        List<String> actualProceduresList = new ArrayList<>();
        actualProceduresList = filterPage.getRolesList(actualProceduresList);
        assertTrue(actualProceduresList.containsAll(givenProceduresList));
    }

    @When("click on reset button")
    public void clickOnResetButton() {
        filterPage.clickOnResetButton();
    }

    @When("tick {string} in filter section")
    public void tickInActCategoryUnderFilterSection(String filter) {
        filterPage.clickOnCheckBox(filter);
    }

    @Then("{string} is ticked in filter section")
    public void inActCategoryIsTicked(String filter) {
        assertTrue(filterPage.isCheckBoxTicked(filter));
    }

    @Then("{string} is unTicked in filter section")
    public void isUnTickedInActCategoryUnderFilterSection(String filter) {
        assertFalse(filterPage.isCheckBoxTicked(filter));
    }
}