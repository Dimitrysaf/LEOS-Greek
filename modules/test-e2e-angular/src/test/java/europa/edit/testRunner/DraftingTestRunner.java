package europa.edit.testRunner;

import europa.edit.util.SuiteListener;
import europa.edit.util.TestListener;
import io.cucumber.testng.AbstractTestNGCucumberTests;
import io.cucumber.testng.CucumberOptions;
import org.testng.annotations.Listeners;

@CucumberOptions(
        features = {"classpath:europa/edit/features/01_Drafting_RepositoryBrowserPage.feature", "classpath:europa/edit/features/02_Drafting_CreateProposal.feature", "classpath:europa/edit/features/03_Drafting_ProposalViewerPage.feature"}
        ,plugin = {"pretty", "html:target/cucumber/report.html", "json:target/cucumber/reports.json", "junit:target/junit-reports/reports.xml", "com.aventstack.extentreports.cucumber.adapter.ExtentCucumberAdapter:", "rerun:target/results/failed-reports/failedTestCases.txt"}
        ,glue = {"europa/edit/stepdef","europa/edit/appHooks"}
        ,monochrome = true
)

@Listeners({SuiteListener.class, TestListener.class})
public class DraftingTestRunner extends AbstractTestNGCucumberTests {
}
