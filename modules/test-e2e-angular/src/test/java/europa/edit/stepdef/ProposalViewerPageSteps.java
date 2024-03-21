package europa.edit.stepdef;

import europa.edit.pages.*;
import europa.edit.util.BaseDriver;
import europa.edit.util.WebDriverFactory;
import io.cucumber.datatable.DataTable;
import io.cucumber.java.en.And;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

import static org.testng.Assert.*;

public class ProposalViewerPageSteps extends BaseDriver {

    private ProposalViewerPage proposalViewerPage;
    private ChangeTitlePage changeTitlePage;
    private DialogBoxPage dialogBoxPage;
    private MilestoneTabPage milestoneTabPage;
    private AddMilestonePage addMilestonePage;

    @Then("user is on proposal viewer page")
    public void userIsOnOverviewScreen() {
        proposalViewerPage = new ProposalViewerPage(WebDriverFactory.getDriver());
        assertEquals(proposalViewerPage.getEUILabelText(), "Proposal View");
    }

    @And("title of the proposal contains {string} keyword")
    public void titleOfTheProposalContainsKeyword(String arg0) {
        assertTrue(proposalViewerPage.getProposalTitle().contains(arg0));
    }

    @And("close button is displayed and enabled in proposal viewer page")
    public void closeButtonIsDisplayedAndEnabledInProposalViewerPage() {
        assertTrue(proposalViewerPage.isCloseButtonDisplayed());
        assertTrue(proposalViewerPage.isCloseButtonEnabled());
    }

    @And("cover page section is present")
    public void coverPageSectionIsPresent() {
        assertTrue(proposalViewerPage.isCoverPageSectionDisplayed());
    }

    @And("explanatory memorandum section is present")
    public void explanatoryMemorandumSectionIsPresent() {
        assertTrue(proposalViewerPage.isExpMemoSectionDisplayed());
    }

    @And("legal act section is present")
    public void legalActSectionIsPresent() {
        assertTrue(proposalViewerPage.isLegalActSectionDisplayed());
    }

    @And("financial statement section is present")
    public void financialStatementSectionIsPresent() {
        assertTrue(proposalViewerPage.isFinanceStatementSectionDisplayed());
    }

    @And("{string} content is displayed under financial statement section")
    public void contentIsDisplayedUnderFinancialStatementSection(String content) {
        assertTrue(proposalViewerPage.contentDisplayedUnderFinancialStatement(content));
    }

    @And("annexes section is present")
    public void annexesSectionIsPresent() {
        assertTrue(proposalViewerPage.isAnnexesSectionDisplayed());
    }

    @And("{string} content is displayed under annexes section")
    public void contentIsDisplayedUnderAnnexesSection(String content) {
        assertTrue(proposalViewerPage.contentDisplayedUnderFAnnexesSection(content));
    }

    @When("click on add button present under annexes section")
    public void clickOnAddButtonPresentUnderAnnexesSection() {
        proposalViewerPage.clickAnnexAddButton();
    }

    @And("numbers of annex present in annexes section are {int}")
    public void numbersOfAnnexPresentInAnnexesSectionAre(int numAnnex) {
        int num = proposalViewerPage.getNumberOfAnnexes();
        assertEquals(num, numAnnex);
    }

    @And("title of Annex {int} is {string}")
    public void titleOfAnnexIs(int annexIndex, String givenAnnexTitle) {
        String actualAnnexTitle = proposalViewerPage.getAnnexTitle(annexIndex);
        assertEquals(actualAnnexTitle, givenAnnexTitle);
    }

    @When("click on actions button present in proposal viewer screen")
    public void clickOnActionsButtonPresentInProposalViewerScreen() {
        proposalViewerPage.clickOnActionButton();
    }

    @When("click on download button")
    public void clickOnDownloadButton() {
        proposalViewerPage.clickDownloadButton();
    }

    @When("click on close button present in proposal viewer page")
    public void clickOnCloseButtonPresentInProposalViewerPage() {
        proposalViewerPage.clickOnCloseButton();
    }

    @And("{string} is showing in tab {int}")
    public void isShowingInTab(String tabName, int tabIndex) {
        String actualTabName = proposalViewerPage.getTabName(tabIndex);
        assertEquals(actualTabName, tabName);
    }

    @And("active tab name is {string}")
    public void activeTabNameIs(String tabName) {
        String activeTabName = proposalViewerPage.getActiveTabName();
        assertEquals(activeTabName, tabName);
    }

    @Then("{int} annexes found under annexes section")
    public void annexesFoundUnderAnnexesSection(int annexNum) {
        assertEquals(annexNum, proposalViewerPage.getNumberOfAnnexes());
    }

    @When("click on change title button")
    public void clickOnChangeTitleButton() {
        proposalViewerPage.clickChangeTitleButton();
    }

    @Then("change title windows pop up is displayed")
    public void changeTitleWindowsPopUpIsDisplayed() {
        changeTitlePage = new ChangeTitlePage(WebDriverFactory.getDriver());
        assertEquals(changeTitlePage.getHeaderTitle(), "Change proposal title");
    }

    @Then("save button is displayed and enabled in change title windows pop up")
    public void saveButtonIsDisplayedAndEnabledInChangeTitleWindowsPopUp() {
        assertTrue(changeTitlePage.isSaveButtonDisplayed());
        assertTrue(changeTitlePage.isSaveButtonEnabled());
    }

    @And("cancel button is displayed and enabled in change title windows pop up")
    public void cancelButtonIsDisplayedAndEnabledInChangeTitleWindowsPopUp() {
        assertTrue(changeTitlePage.isCancelButtonDisplayed());
        assertTrue(changeTitlePage.isCancelButtonEnabled());
    }

    @When("append {string} keyword in the title of the proposal")
    public void appendKeywordInTheTitleOfTheProposalMandate(String newTitle) {
        changeTitlePage.appendNewTitle(newTitle);
    }

    @And("click on save button in change title windows pop up")
    public void clickOnSaveButtonInChangeTitleWindowsPopUp() {
        changeTitlePage.clickSaveButton();
    }

    @When("click on delete button present in proposal viewer screen")
    public void clickOnDeleteButton() {
        proposalViewerPage.clickOnDeleteButton();
    }

    @Then("delete proposal confirmation windows pop up is displayed")
    public void deleteProposalConfirmationWindowsPopUpIsDisplayed() {
        dialogBoxPage = new DialogBoxPage(WebDriverFactory.getDriver());
        assertEquals(dialogBoxPage.getHeaderTitle(), "Delete proposal confirmation");
    }

    @And("cancel button is displayed and enabled in delete proposal confirmation windows pop up")
    public void cancelButtonIsDisplayedAndEnabledInDeleteProposalConfirmationWindowsPopUp() {
        assertTrue(dialogBoxPage.isCancelButtonDisplayed());
        assertTrue(dialogBoxPage.isCancelButtonEnabled());
    }

    @And("delete button is displayed and enabled in delete proposal confirmation windows pop up")
    public void deleteButtonIsDisplayedAndEnabledInDeleteProposalConfirmationWindowsPopUp() {
        assertTrue(dialogBoxPage.isDeleteButtonDisplayed());
        assertTrue(dialogBoxPage.isDeleteButtonEnabled());
    }

    @When("click on delete button in delete proposal confirmation windows pop up")
    public void clickOnDeleteButtonInDeleteProposalConfirmationWindowsPopUp() {
        dialogBoxPage.clickOnDangerButton();
    }

    @When("click on milestones tab")
    public void clickOnMilestonesTab() {
        proposalViewerPage.clickMileStonesTab();
    }

    @Then("milestones tab is displayed")
    public void milestonesTabIsDisplayed() {
        milestoneTabPage = new MilestoneTabPage(WebDriverFactory.getDriver());
        assertEquals(proposalViewerPage.getActiveTabName(), "Milestones");
    }

    @When("click on add button in milestones tab")
    public void clickOnAddButtonInMilestonesTab() {
        milestoneTabPage.clickAddButton();
    }

    @And("no row is present in milestone table")
    public void noRowIsPresentInMilestoneTable() {
        assertFalse(milestoneTabPage.isRowPresentInTable());
    }

    @Then("add milestone window pop up is displayed")
    public void addMilestoneWindowPopUpIsDisplayed() {
        addMilestonePage = new AddMilestonePage(WebDriverFactory.getDriver());
        assertEquals(addMilestonePage.getHeaderTitle(), "Add milestone");
    }

    @When("click on milestone dropdown icon")
    public void clickOnMilestoneDropdownIcon() {
        addMilestonePage.clickOnMilestoneDropDown();
    }

    @Then("{string} option is selected by default in milestone dropdown")
    public void optionIsSelectedByDefaultInMilestoneDropdown(String option) {
        assertEquals(addMilestonePage.getOptionSelectedBydefault(), option);
    }

    @Then("milestone title text box is disabled")
    public void milestoneTitleTextBoxIsDisabled() {
        assertFalse(addMilestonePage.isTitleTextBoxEnabled());
    }

    @When("click on milestone option {string}")
    public void clickOnMilestoneOptionAsOther(String option) {
        addMilestonePage.clickMilestoneOption(option);
    }

    @When("click on create milestone button")
    public void clickOnCreateMilestoneButton() {
        addMilestonePage.clickOnCreateMilestoneButton();
    }

    @And("type {string} in title box")
    public void typeInTitleBox(String input) {
        addMilestonePage.typeTextInTextBox(input);
    }

    @Then("these are below options displayed for milestone dropdown")
    public void theseAreBelowOptionsDisplayedForMilestoneDropdown(DataTable dataTable) {
        List<String> givenMilestoneDetails = dataTable.asList(String.class);
        List<String> actualMilestoneDetails = addMilestonePage.getMilestoneOptions();
        for(String option : givenMilestoneDetails){
            System.out.println(option);
        }
        for(String option1 : actualMilestoneDetails){
            System.out.println(option1);
        }
        assertTrue(actualMilestoneDetails.containsAll(givenMilestoneDetails));
    }

    @And("{string} is showing under title column of row {int} of milestones table")
    public void isShowingUnderTitleColumnOfRowOfMilestonesTable(String text, int rowNumber) {
        String title = milestoneTabPage.getTextForTitleColumn(rowNumber);
        assertEquals(title, text);
    }

    @And("today's date is showing under date column of row {int} of milestones table")
    public void todaySDateIsShowingUnderDateColumnOfRowOfMilestonesTable(int rowNumber) {
        String date = milestoneTabPage.getTextForDateColumn(rowNumber);
        assertNotNull(date);
        String dateInString = new SimpleDateFormat("dd/MM/yyyy").format(new Date());
        String subStringDate = date.substring(0, date.length() - 6);
        assertEquals(subStringDate, dateInString);
    }

    @And("{string} is showing under status column of row {int} of milestones table")
    public void isShowingUnderStatusColumnOfRowOfMilestonesTable(String text, int rowNumber) {
        String status = milestoneTabPage.getTextForStatusColumn(rowNumber);
        assertEquals(status, text);
    }

    @When("click on cover page link")
    public void clickOnCoverPageLink() {
        proposalViewerPage.clickOnCoverPageLInk();
    }

    @Then("share button is displayed and enabled")
    public void shareButtonIsDisplayedAndEnabled() {
        assertTrue(proposalViewerPage.isShareBtnDisplayedAndEnabled());
    }

    @And("delete button is not displayed")
    public void deleteButtonIsNotDisplayed() {
        assertTrue(proposalViewerPage.isDeleteBtnNotPresent());
    }

    @And("download button is not displayed")
    public void downloadButtonIsNotDisplayed() {
        assertTrue(proposalViewerPage.isDownloadBtnNotPresent());
    }

    @When("click on delete button present in overview screen")
    public void clickOnDeleteButtonPresentInOverviewScreen() {
        proposalViewerPage.clickOnDeleteButton();
    }

    @And("export as pdf button is not displayed")
    public void exportAsPdfButtonIsNotDisplayed() {
        assertTrue(proposalViewerPage.isExportAsPdfBtnNotPresent());
    }
}