package europa.edit.pages;

import europa.edit.util.Constants;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.CacheLookup;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.pagefactory.AjaxElementLocatorFactory;

import static europa.edit.util.E2eUtil.waitForLoadingProgressBarToDisappear;

public class AnnotationPage {

    private final WebDriver driver;

    @FindBy(css = ".annotations-pane .eui-page-column__header-left-content-label")
    @CacheLookup
    WebElement EUI_PAGE_COLUMN_HEADER_CONTENT_LABEL;

    By EUI_ICON_ANGLE_RIGHT = By.cssSelector(".annotations-pane button .eui-icon-angle-right");

    public AnnotationPage(WebDriver driver){
        this.driver = driver;
        waitForLoadingProgressBarToDisappear(driver);
        AjaxElementLocatorFactory ajax=new AjaxElementLocatorFactory(driver, Constants.TIMEOUT_DELAY);
        PageFactory.initElements(ajax, this);
    }

    public String getEUIPageHeaderLabel() {
        return EUI_PAGE_COLUMN_HEADER_CONTENT_LABEL.getText();
    }
}
