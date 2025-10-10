package europa.edit.stepDefinition;

import com.aventstack.extentreports.cucumber.adapter.ExtentCucumberAdapter;
import io.cucumber.core.logging.Logger;
import io.cucumber.core.logging.LoggerFactory;
import io.cucumber.java.After;
import io.cucumber.java.Before;
import io.cucumber.java.Scenario;
import io.cucumber.java.BeforeStep;
import io.cucumber.java.AfterStep;

public class HooksScenarios {
    private static final Logger logger = LoggerFactory.getLogger(HooksScenarios.class);

    @Before()
    public void launch() {
    }

    @After()
    public void tearDown(Scenario scenario) {
    }

    @BeforeStep
    public void beforeStep() {
    }

    @AfterStep
    public void afterStep(Scenario scenario) {
    }
}
