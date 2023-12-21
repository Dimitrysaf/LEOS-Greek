package europa.edit.pages;

import europa.edit.util.Constants;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.CacheLookup;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.pagefactory.AjaxElementLocatorFactory;

import static europa.edit.util.E2eUtil.waitForLoadingProgressBarToDisappear;

public class CoverPage extends HeaderPage{

    private final WebDriver driver;

    public CoverPage(WebDriver driver){
        super(driver);
        this.driver = driver;
        waitForLoadingProgressBarToDisappear(driver);
        AjaxElementLocatorFactory ajax=new AjaxElementLocatorFactory(driver, Constants.TIMEOUT_DELAY);
        PageFactory.initElements(ajax, this);
    }

}
