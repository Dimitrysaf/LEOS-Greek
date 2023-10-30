package europa.edit.stepdef;

import europa.edit.pages.LoginPage;
import europa.edit.util.BaseDriver;
import europa.edit.util.Cryptor;
import europa.edit.util.WebDriverFactory;
import io.cucumber.java.en.And;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;

import static org.testng.Assert.assertEquals;


public class LoginPageSteps extends BaseDriver {

    private LoginPage loginPage;

    @Then("user is on login page")
    public void userIsOnLoginPage() {
        loginPage = new LoginPage(WebDriverFactory.getDriver());
        String title =  loginPage.getTitle();
        assertEquals(title, "Login");
    }

    @When("user enters password {string}")
    public void userEntersPassword(String pwd) {
        Cryptor crypt = new Cryptor();
        String password = crypt.decrypt(config.getProperty(pwd));
        loginPage.enterPassword(password);
    }

    @And("user clicks on sign in button")
    public void userClicksOnSignInButton() {
        loginPage.clickSignIn();
    }
}