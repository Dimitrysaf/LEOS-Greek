package europa.edit.pages;

import europa.edit.util.Constants;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.CacheLookup;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.pagefactory.AjaxElementLocatorFactory;

import java.util.List;

import static europa.edit.util.E2eUtil.waitForLoadingProgressBarToDisappear;

public class MilestoneTabPage {

    private final WebDriver driver;

    @FindBy(css = "app-proposal-milestones button.eui-button--primary")
    @CacheLookup
    WebElement ADD_BTN;

    @FindBy(css = "table.eui-table.eui-table--responsive")
    @CacheLookup
    WebElement MILESTONE_TABLE;

    public MilestoneTabPage(WebDriver driver) {
        this.driver = driver;
        waitForLoadingProgressBarToDisappear(driver);
        AjaxElementLocatorFactory ajax=new AjaxElementLocatorFactory(driver, Constants.TIMEOUT_DELAY);
        PageFactory.initElements(ajax, this);
    }

    public void clickAddButton() {
        ADD_BTN.click();
    }

    public boolean isRowPresentInTable() {
        List<WebElement> rows = MILESTONE_TABLE.findElements(By.cssSelector("tbody tr"));
        return rows.size() > 0;
    }

    public String getTextForTitleColumn(int rowNumber) {
        return MILESTONE_TABLE.findElement(By.cssSelector("tbody tr:nth-child("+rowNumber+") td:nth-child(2)")).getText();
    }

    public String getTextForDateColumn(int rowNumber) {
        return MILESTONE_TABLE.findElement(By.cssSelector("tbody tr:nth-child("+rowNumber+") td:nth-child(3)")).getText();
    }

    public String getTextForStatusColumn(int rowNumber) {
        return MILESTONE_TABLE.findElement(By.cssSelector("tbody tr:nth-child("+rowNumber+") td:nth-child(4)")).getText();
    }
}
