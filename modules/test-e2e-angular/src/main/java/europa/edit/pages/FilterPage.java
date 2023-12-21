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

import static europa.edit.util.E2eUtil.*;

public class FilterPage {

    private final WebDriver driver;

    @FindBy(xpath = "//*[contains(text(),'Filters')]")
    @CacheLookup
    WebElement FILTERS_TXT;

    @FindBy(xpath = "//*[contains(text(),'Reset')]")
    @CacheLookup
    WebElement RESET_TXT;

    @FindBy(css = ".filters-search-input input")
    @CacheLookup
    WebElement FILTERS_SEARCH_INPUT;

    @FindBy(css = ".filters-search-input button")
    @CacheLookup
    WebElement FILTERS_SEARCH_BTN;

/*    @FindBy(css = ".eui-icon-angle-left")
    @CacheLookup
    WebElement EUI_ICON_ANGLE_LEFT;

    @FindBy(xpath = "//label[contains(text(),'Search')]")
    @CacheLookup
    WebElement SEARCH_TXT;*/

    public FilterPage(WebDriver driver) {
        this.driver = driver;
        AjaxElementLocatorFactory ajax = new AjaxElementLocatorFactory(driver, Constants.TIMEOUT_DELAY);
        PageFactory.initElements(ajax, this);
    }

    private final By PROCEDURES = By.cssSelector(".filters-checkboxes-section:nth-child(1) label");
    private final By ACTS = By.cssSelector(".filters-checkboxes-section:nth-child(2) label");
    private final By TEMPLATES = By.cssSelector(".filters-checkboxes-section:nth-child(3) label");
    private final By ROLES = By.cssSelector(".filters-checkboxes-section:nth-child(4) label");

    public boolean isFilterSectionDisplayed() {
        return waitForElementTobeDisPlayed(driver, FILTERS_TXT);
    }

    public boolean isSearchTextBoxDisplayed() {
        return waitForElementTobeDisPlayed(driver, FILTERS_SEARCH_INPUT);
    }

    public boolean isSearchButtonDisplayedAndEnabled() {
        return isElementDisplayedAndEnabled(FILTERS_SEARCH_BTN);
    }

    public boolean isResetButtonDisplayedAndEnabled() {
        return isElementDisplayedAndEnabled(RESET_TXT);
    }

    public void clickOnResetButton() {
        elementClick(driver, RESET_TXT);
        waitForLoadingProgressBarToDisappear(driver);
    }

    public List<String> getProceduresList(List<String> actualProceduresList) {
        return getFilterValue(actualProceduresList, PROCEDURES);
    }

    public List<String> getActsList(List<String> actualProceduresList) {
        return getFilterValue(actualProceduresList, ACTS);
    }

    public List<String> getTemplatesList(List<String> actualProceduresList) {
        return getFilterValue(actualProceduresList, TEMPLATES);
    }

    public List<String> getRolesList(List<String> actualProceduresList) {
        return getFilterValue(actualProceduresList, ROLES);
    }

    private List<String> getFilterValue(List<String> actualProceduresList, By by) {
        String filterValue;
        List<WebElement> elements = driver.findElements(by);
        if (null != elements && !elements.isEmpty()) {
            for (WebElement element : elements) {
                filterValue = getElementAttributeTextContent(element).trim();
                actualProceduresList.add(filterValue);
            }
        }
        return actualProceduresList;
    }

    public void clickOnCheckBox(String filter) {
        elementClickJS(driver, driver.findElement(By.cssSelector("input[id='" + filter + "']")));
        waitForLoadingProgressBarToDisappear(driver);
    }

    public boolean isCheckBoxTicked(String filter) {
        return isElementSelected(driver.findElement(By.cssSelector("input[id='" + filter + "']")));
    }

    public void enterSearchText(String keyWords) {
        elementSendKeys(driver, FILTERS_SEARCH_INPUT, keyWords);
        waitForLoadingProgressBarToDisappear(driver);
    }

}
