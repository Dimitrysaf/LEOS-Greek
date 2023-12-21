package europa.edit.pages;

import europa.edit.util.Constants;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.CacheLookup;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.pagefactory.AjaxElementLocatorFactory;
import org.openqa.selenium.support.ui.Select;

import java.util.ArrayList;
import java.util.List;

import static europa.edit.util.E2eUtil.getElementAttributeValue;
import static europa.edit.util.E2eUtil.waitForLoadingProgressBarToDisappear;

public class AddMilestonePage {

    private final WebDriver driver;

    @FindBy(css = "eui-dialog-header .eui-dialog__header-title")
    @CacheLookup
    WebElement MILESTONE_HEADER_TITLE;

    @FindBy(id = "milestone_type")
    @CacheLookup
    WebElement MILESTONE_DROPDOWN;

    @FindBy(css = "input#milestonesTitle")
    @CacheLookup
    WebElement MILESTONE_TEXT_BOX;

    @FindBy(css = "eui-dialog-footer button.eui-button--primary")
    @CacheLookup
    WebElement PRIMARY_BUTTON;

/*    @FindBy(css = "eui-dialog-footer button.eui-button--secondary")
    @CacheLookup
    WebElement SECONDARY_BUTTON;*/

    public AddMilestonePage(WebDriver driver) {
        this.driver = driver;
        waitForLoadingProgressBarToDisappear(driver);
        AjaxElementLocatorFactory ajax=new AjaxElementLocatorFactory(driver, Constants.TIMEOUT_DELAY);
        PageFactory.initElements(ajax, this);
    }

    public String getHeaderTitle() {
        return MILESTONE_HEADER_TITLE.getText();
    }

    public void clickOnMilestoneDropDown() {
        MILESTONE_DROPDOWN.click();
    }

    public String getOptionSelectedBydefault() {
        return getElementAttributeValue(MILESTONE_DROPDOWN);
    }

    public boolean isTitleTextBoxEnabled() {
        return MILESTONE_TEXT_BOX.isEnabled();
    }

    public void clickOnCreateMilestoneButton() {
        PRIMARY_BUTTON.click();
    }

    public void clickMilestoneOption(String option) {
        Select objSelect =new Select(MILESTONE_DROPDOWN);
        objSelect.selectByValue(option);
    }

    public void typeTextInTextBox(String input) {
        MILESTONE_TEXT_BOX.sendKeys(input);
    }

    public List<String> getMilestoneOptions() {
        List<String> milestoneOptions = new ArrayList<>();
        List<WebElement> options = MILESTONE_DROPDOWN.findElements(By.cssSelector("option"));
        for(WebElement option : options){
            milestoneOptions.add(option.getText().trim());
        }
        return milestoneOptions;
    }
}
