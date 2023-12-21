package europa.edit.stepdef;

import europa.edit.pages.AnnotationPage;
import europa.edit.util.BaseDriver;
import europa.edit.util.WebDriverFactory;
import io.cucumber.java.en.And;

import static org.testng.Assert.assertEquals;


public class AnnotationPageSteps extends BaseDriver {

    private AnnotationPage annotationPage;

    @And("annotation side bar is present")
    public void annotationSideBarIsPresent() {
        annotationPage = new AnnotationPage(WebDriverFactory.getDriver());
        assertEquals(annotationPage.getEUIPageHeaderLabel(), "Annotations & document notes");
    }
}