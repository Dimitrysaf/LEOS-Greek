package europa.edit.stepdef;

import com.google.common.collect.ImmutableMap;
import europa.edit.pages.*;
import europa.edit.util.BaseDriver;
import europa.edit.util.WebDriverFactory;
import io.cucumber.datatable.DataTable;
import io.cucumber.java.en.And;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import org.openqa.selenium.By;
import org.openqa.selenium.io.Zip;
import org.openqa.selenium.json.Json;
import org.openqa.selenium.remote.RemoteWebDriver;
import org.openqa.selenium.remote.http.HttpClient;
import org.openqa.selenium.remote.http.HttpRequest;
import org.openqa.selenium.remote.http.HttpResponse;

import java.io.File;
import java.io.IOException;
import java.net.MalformedURLException;
import java.net.URL;
import java.nio.file.Files;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static europa.edit.util.E2eUtil.*;
import static org.openqa.selenium.remote.http.Contents.asJson;
import static org.openqa.selenium.remote.http.Contents.string;
import static org.openqa.selenium.remote.http.HttpMethod.GET;
import static org.openqa.selenium.remote.http.HttpMethod.POST;
import static org.testng.Assert.assertTrue;

public class CommonSteps extends BaseDriver {
    private RepositoryBrowserPage repositoryBrowserPage;
    ProposalViewerPage proposalViewerPage;
    DialogBoxPage dialogBoxPage;

    @And("^sleep for (.*) milliseconds")
    public void sleepForMilliseconds(long time) {
        try {
            Thread.sleep(time);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }

    @And("delete all the proposal containing keyword")
    public void deleteAllTheProposalContainingKeyword(DataTable dataTable) {
        List<String> details = dataTable.asList(String.class);
        int proposalNumber = 1;
        repositoryBrowserPage = new RepositoryBrowserPage(WebDriverFactory.getDriver());
        for (String keyword : details) {
            while (findNumberOfRowsRepoPage(keyword)) {
                proposalViewerPage = repositoryBrowserPage.clickOnNthProposal(proposalNumber);
                proposalViewerPage.clickOnActionButton();
                dialogBoxPage = proposalViewerPage.clickOnDeleteButton();
                String dialogBoxBodyContent = dialogBoxPage.getBodyContent();
                if("Are you sure you want to delete this proposal".equals(dialogBoxBodyContent)){
                    repositoryBrowserPage = dialogBoxPage.clickOnDangerButton();
                    assertTrue(repositoryBrowserPage.isCreateProposalBtnDisplayedAndEnabled());
                    assertTrue(repositoryBrowserPage.isUploadBtnIsDisplayedAndEnabled());
                    proposalNumber = 1;
                }
                else{
                    proposalNumber++;
                    dialogBoxPage.clickOnCancelButton();
                    repositoryBrowserPage = proposalViewerPage.clickOnCloseButton();
                }
            }
        }
    }

    @And("delete all the mandate containing keyword")
    public void deleteAllTheMandateContainingKeyword(DataTable dataTable) {
        List<String> details = dataTable.asList(String.class);
        repositoryBrowserPage = new RepositoryBrowserPage(WebDriverFactory.getDriver());
        for (String keyword : details) {
            while (findNumberOfRowsRepoPage(keyword)) {
                proposalViewerPage = repositoryBrowserPage.clickOnNthProposal(1);
                proposalViewerPage.clickOnActionButton();
                dialogBoxPage = proposalViewerPage.clickOnDeleteButton();
                repositoryBrowserPage = dialogBoxPage.clickOnDangerButton();
                assertTrue(repositoryBrowserPage.isCreateDraftBtnDisplayedAndEnabled());
                assertTrue(repositoryBrowserPage.isCreateMandateBtnDisplayedAndEnabled());
            }
        }
    }

    public boolean findNumberOfRowsRepoPage(String str) {
        FilterPage filterPage = new FilterPage(WebDriverFactory.getDriver());
        filterPage.enterSearchText(str);
        repositoryBrowserPage = new RepositoryBrowserPage(WebDriverFactory.getDriver());
        try {
            return repositoryBrowserPage.isProposalListDisplayed();
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    @When("move the downloaded file to relative location {string}")
    public void moveTheDownloadedFileToRelativeLocation(String relativeLocation) throws MalformedURLException {
        URL gridUrl = new URL(config.getProperty("grid.url"));
        System.out.println("getSessionId " + ((RemoteWebDriver) WebDriverFactory.getDriver()).getSessionId());
        String downloadsEndpoint = String.format("/session/%s/se/files", ((RemoteWebDriver) WebDriverFactory.getDriver()).getSessionId());
        System.out.println("downloadsEndpoint " + downloadsEndpoint);
        String fileToDownload;
        try (HttpClient client = HttpClient.Factory.createDefault().createClient(gridUrl)) {
            HttpRequest request = new HttpRequest(GET, downloadsEndpoint);
            HttpResponse response = client.execute(request);
            Map<String, Object> jsonResponse = new Json().toType(string(response), Json.MAP_TYPE);
            System.out.println("jsonResponse " + jsonResponse);
            Map<String, Object> value = (Map<String, Object>) jsonResponse.get("value");
            System.out.println("value " + value);
            List<String> names = (List<String>) value.get("names");
            System.out.println("names " + names);
            fileToDownload = names.get(0);
            request = new HttpRequest(POST, downloadsEndpoint);
            request.setContent(asJson(ImmutableMap.of("name", fileToDownload)));
            response = client.execute(request);
            jsonResponse = new Json().toType(string(response), Json.MAP_TYPE);
            value = (Map<String, Object>) jsonResponse.get("value");
            String zippedContents = value.get("contents").toString();
            File downloadDir = Zip.unzipToTempDir(zippedContents, "download", "");
            File downloadedFile = Optional.ofNullable(downloadDir.listFiles()).orElse(new File[]{})[0];
            String userDirectory = new File("").getAbsolutePath();
            File dest = new File(userDirectory + relativeLocation + File.separator + fileToDownload);
            if (!dest.exists()) {
                dest.mkdirs();
            }
            Files.move(downloadedFile.toPath(), dest.toPath(), StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    @And("unzip recent {string} file from relative location {string} and put the unzipped files in relative location {string}")
    public void unzipRecentFileFromRelativeLocationAndPutTheUnzippedFilesInRelativeLocation(String fileType, String sourceRelativeLocation, String destRelativeLocation) throws IOException {
        File file = findRecentFile(fileType, sourceRelativeLocation);
        assert file != null;
        String destFullPath;
        if (fileType.equalsIgnoreCase("leg")) {
            destFullPath = System.getProperty("user.dir") + destRelativeLocation + File.separator + file.getName().split("\\.")[0];
        } else {
            destFullPath = System.getProperty("user.dir") + destRelativeLocation;
        }
        File dest = new File(destFullPath);
        if (!dest.exists()) {
            dest.mkdirs();
        }
        unZipFile(file.getPath(), destFullPath);
    }

    @And("click refresh button")
    public void clickRefreshButton() {
        WebDriverFactory.getDriver().navigate().refresh();
    }

    @Then("{string} message is displayed")
    public void messageIsDisplayed(String message) {
        boolean bool = waitForElementTobeDisPlayed(WebDriverFactory.getDriver(), By.xpath("//*[contains(text(),'" + message + "')]"));
        assertTrue(bool);
    }

    @Then("find the recent folder from relative path {string} and check {string} files contain below names")
    public void findTheRecentFolderFromRelativePathAndCheckFilesContainBelowNames(String relativeLocation, String fileType, DataTable dataTable) {
        List<String> givenFileNames = dataTable.asList(String.class);
        List<String> actualFileNames = new ArrayList<>();
        String folderName = findRecentFolderFromLocal(relativeLocation);
        List<String> FileNames = findFilesFromGivenPath(relativeLocation + File.separator + folderName, fileType);
        for (String fileName : FileNames) {
            try {
                actualFileNames.add(fileName.split("-")[0]);
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
        assertTrue(givenFileNames.containsAll(actualFileNames));
    }
}