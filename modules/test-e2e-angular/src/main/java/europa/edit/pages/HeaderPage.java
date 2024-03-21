package europa.edit.pages;

import europa.edit.util.Constants;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.CacheLookup;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.pagefactory.AjaxElementLocatorFactory;

import java.util.List;

import static europa.edit.util.E2eUtil.*;

public class HeaderPage {

    private final WebDriver driver;

    @FindBy(css = ".eui-user-profile__infos-name")
    WebElement EUI_USER_PROFILE_INFO_NAME;

    @FindBy(css = "eui-breadcrumb-item.eui-breadcrumb-item button")
    @CacheLookup
    List<WebElement> EUI_BREADCRUMB_ITEM_BUTTON;

    @FindBy(css = "eui-breadcrumb-item span.eui-label")
    WebElement EUI_LABEL;

    @FindBy(xpath = "//a//*[text()=' Home ']")
    @CacheLookup
    WebElement HOME_LINK;

/*    @FindBy(css = "div.eui-user-profile__avatar")
    @CacheLookup
    WebElement EUI_USER_PROFILE_AVATAR;

    @FindBy(css = "div  a.eui-language-selector-link")
    @CacheLookup
    WebElement EUI_LANGUAGE_SELECTOR_LINK;

    @FindBy(css = "div.eui-toolbar-app")
    @CacheLookup
    WebElement EUI_TOOLBAR_APP;

    @FindBy(css = ".eui-toolbar-logo.ng-star-inserted")
    @CacheLookup
    WebElement EUI_TOOLBAR_LOGO;*/

    public HeaderPage(WebDriver driver){
        this.driver = driver;
        waitForPageLoad(driver, Constants.TIMEOUT_DELAY);
        AjaxElementLocatorFactory ajax=new AjaxElementLocatorFactory(driver, Constants.TIMEOUT_DELAY);
        PageFactory.initElements(ajax, this);
    }

    public String getEUILabelText() {
        return EUI_LABEL.getText();
    }

    public void clickHomeLink() {
        elementClick(driver, HOME_LINK);
    }

    public void clickHomeButtonInBreadCrumb() {
        elementClick(driver, EUI_BREADCRUMB_ITEM_BUTTON.get(0));
    }

    public boolean isUserNamePresent() {
        return waitForElementTobeDisPlayed(driver, EUI_USER_PROFILE_INFO_NAME);
    }
}
