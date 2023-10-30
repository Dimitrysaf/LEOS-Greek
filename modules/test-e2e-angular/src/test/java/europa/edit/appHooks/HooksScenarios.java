package europa.edit.appHooks;

import europa.edit.util.*;
import io.cucumber.java.After;
import io.cucumber.java.Before;
import io.cucumber.java.Scenario;
import org.apache.commons.io.FileUtils;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.logging.LogEntries;
import org.openqa.selenium.logging.LogEntry;
import org.openqa.selenium.logging.LogType;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.testng.ITestResult;
import org.testng.Reporter;

import java.io.File;
import java.util.List;

public class HooksScenarios {
    private static final Logger logger = LoggerFactory.getLogger(HooksScenarios.class);
    private WebDriver driver;
    WebDriverFactory webDriverFactory;

    @Before()
    public void launchBrowser() {
        webDriverFactory = new WebDriverFactory();
        driver = webDriverFactory.setUp_driver();
    }

    @After()
    public void tearDown(Scenario scenario) {
        if (scenario.isFailed()) {
            E2eUtil.takeSnapShot(driver, "FAIL");
            Reporter.getCurrentTestResult().setStatus(ITestResult.FAILURE);
            scenario.log("Click below for Screenshot");
            try {
                byte[] bytes = FileUtils.readFileToByteArray(new File(TestParameters.getInstance().getScreenshotPath()));
                scenario.attach(bytes, "image/png", "ErrorScreenshot");
                LogEntries entry = driver.manage().logs().get(LogType.BROWSER);
                List<LogEntry> logs = entry.getAll();
                for (LogEntry e : logs) {
                    logger.info("Level is: " + e.getLevel());
                    logger.info("Message is: " + e.getMessage());
                }
            } catch (Exception e) {
                scenario.log("Exception happen while getting screenshot");
            }
        }
        TestParameters.getInstance().reset();
        try {
            if (null != driver) {
                driver.quit();
                scenario.log("Close Browser");
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
