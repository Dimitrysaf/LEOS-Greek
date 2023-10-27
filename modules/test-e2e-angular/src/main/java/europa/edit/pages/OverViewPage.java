package europa.edit.pages;

import europa.edit.util.Constants;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.CacheLookup;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.pagefactory.AjaxElementLocatorFactory;

public class OverViewPage extends HeaderPage{

    private final WebDriver driver;

    @FindBy(xpath = "//*[@class='eui-tab-item__label' and text()='Drafts']")
    @CacheLookup
    WebElement DRAFTS_TAB;

    @FindBy(xpath = "//*[@class='eui-tab-item__label' and text()='Milestones']")
    @CacheLookup
    WebElement MILESTONES_TAB;

    @FindBy(xpath = "//*[@class='eui-tab-item__label' and text()=' Exports ']")
    @CacheLookup
    WebElement EXPORTS_TAB;

    @FindBy(xpath = "//*[@class='eui-tab-item__label' and text()='Collaborators']")
    @CacheLookup
    WebElement COLLABORATORS_TAB;

    @FindBy(xpath = "//*[@class='eui-label' and text()='Actions']")
    @CacheLookup
    WebElement ACTIONS_BTN;

    @FindBy(css = ".eui-u-flex-align-items-start h1")
    @CacheLookup
    WebElement PROPOSAL_TITLE;

    @FindBy(xpath = "app-proposal-details .eui-fieldset__container")
    @CacheLookup
    WebElement PROPOSAL_DETAILS_CONTAINER;

    @FindBy(xpath = "div.eui-tab-item--active .eui-tab-item__label")
    @CacheLookup
    WebElement ACTIVE_TAB;

    @FindBy(xpath = "//eui-card-header//*[text()='Drafts']")
    @CacheLookup
    WebElement EUI_CARD_READER_DRAFTS;

    public OverViewPage(WebDriver driver){
        super(driver);
        this.driver = driver;
        AjaxElementLocatorFactory ajax=new AjaxElementLocatorFactory(driver, Constants.TIMEOUT_DELAY);
        PageFactory.initElements(ajax, this);
    }
}
