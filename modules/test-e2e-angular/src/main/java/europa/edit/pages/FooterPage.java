package europa.edit.pages;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;

public class FooterPage {

    private final WebDriver driver;

    private final By LEOS_FOOTER_CONTENT = By.cssSelector(".leos-footer-content");

    public FooterPage(WebDriver driver){
        this.driver = driver;
    }

}
