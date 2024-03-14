package europa.edit.pages;

import europa.edit.util.Constants;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.CacheLookup;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.pagefactory.AjaxElementLocatorFactory;

import static europa.edit.util.E2eUtil.*;

public class HomePage extends HeaderPage {

    private final WebDriver driver;

    @FindBy(xpath = "//eui-label[text()='The online collaboration tool for drafting legislation']")
    @CacheLookup
    WebElement Text;

    @FindBy(xpath = "//button//*[text()=' Upload ']")
    @CacheLookup
    WebElement UPLOAD_BTN;

    @FindBy(xpath = "//button//*[text()=' Create your draft ']")
    @CacheLookup
    WebElement CREATE_YOUR_DRAFT_BTN;

    @FindBy(xpath = "//button//*[text()=' Create mandate ']")
    @CacheLookup
    WebElement CREATE_MANDATE_BTN;

    @FindBy(xpath = "//button//*[text()=' Create Draft ']")
    @CacheLookup
    WebElement CREATE_DRAFT_BTN;

    @FindBy(css = "input#searchInput")
    @CacheLookup
    WebElement SEARCH_INPUT;

    @FindBy(xpath = "//button//*[text()=' View all acts ']")
    @CacheLookup
    WebElement VIEW_ALL_ACTS_BTN;

    @FindBy(css = "app-proposal-home-card[labelkey='page.home.my-latest-activity']")
    @CacheLookup
    WebElement PAGE_HOME_MY_LATEST_ACTIVITY;

    @FindBy(css = "app-proposal-home-card[labelkey='page.home.my-favourites']")
    @CacheLookup
    WebElement PAGE_HOME_MY_FAVOURITES;

    public HomePage(WebDriver driver) {
        super(driver);
        this.driver = driver;
        waitForLoadingProgressBarToDisappear(driver);
        AjaxElementLocatorFactory ajax = new AjaxElementLocatorFactory(driver, Constants.TIMEOUT_DELAY);
        PageFactory.initElements(ajax, this);
    }

    public void clickViewAllActsButton() {
        VIEW_ALL_ACTS_BTN.click();
    }

    public boolean isTextDisplayed() {
        return Text.isDisplayed();
    }

    public boolean isViewAllActsButtonDisplayedAndEnabled() {
        return VIEW_ALL_ACTS_BTN.isDisplayed() && VIEW_ALL_ACTS_BTN.isEnabled();
    }

    public boolean isSearchForProposalInputDisplayedAndEnabled() {
        return SEARCH_INPUT.isDisplayed() && SEARCH_INPUT.isEnabled();
    }

    public boolean isMyLatestActivitySectionDisplayed() {
        return PAGE_HOME_MY_LATEST_ACTIVITY.isDisplayed();
    }

    public boolean isMyFavouritesSectionDisplayed() {
        return PAGE_HOME_MY_FAVOURITES.isDisplayed();
    }
}
