package europa.edit.testRunner;

import europa.edit.util.SuiteListener;
import europa.edit.util.TestListener;
import io.cucumber.testng.AbstractTestNGCucumberTests;
import io.cucumber.testng.CucumberOptions;
import org.testng.annotations.Listeners;


@CucumberOptions(
        features = {"classpath:europa/edit/features/leosApi.feature"}
        ,plugin = {"pretty", "html:target/cucumber/report.html", "json:target/cucumber/reports.json", "junit:target/junit-reports/reports.xml", "com.aventstack.extentreports.cucumber.adapter.ExtentCucumberAdapter:"}
        ,glue = {"europa/edit/stepDefinition"}
        ,monochrome = true
)

@Listeners({SuiteListener.class, TestListener.class})
public class ApiTestRunner extends AbstractTestNGCucumberTests {

}
