package europa.edit.stepDefinition;

import europa.edit.util.ScenarioContext;
import io.cucumber.datatable.DataTable;
import io.cucumber.java.en.And;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import io.restassured.RestAssured;
import io.restassured.response.Response;
import io.restassured.specification.RequestSpecification;

import java.io.File;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.testng.Assert.assertEquals;
import static org.testng.Assert.assertNotNull;
import static org.testng.Assert.assertNull;


public class proposalApiSteps {

    private ScenarioContext context;
    RequestSpecification request;
    private Response response;

    public proposalApiSteps(ScenarioContext context) {
        this.context = context;
    }

    @When("create an act with following request body")
    public void createActWithFollowingRequestBody(String body) {
        RestAssured.baseURI="http://localhost:8080/leos-pilot/api/";
        Map<String, String> headers = new HashMap<>();
        headers.put("Content-Type", "application/json");
        headers.put("Authorization", "Bearer " + context.getValue("accessToken"));
        request = RestAssured.given().headers(headers).body(body);
        response = request.post("/secured/createPackage");
    }

    @Then("status code of createPackage api response is {int}")
    public void statusCodeOfCreatePackageApiResponseIs(int statusCode) {
        int responseCode = response.getStatusCode();
        assertEquals(responseCode, statusCode);
    }

    @And("createPackage api response contains below keys with value not null")
    public void createPackageApiResponseContainsBelowKeys(DataTable dataTable) {
        List<String> keys = dataTable.asList(String.class);
        for (String key : keys) {
            assertNotNull(response.jsonPath().getString(key));
        }
    }

    @When("run upload api with a leg file from a relative location {string}")
    public void runUploadApiWithALegFileFromARelativeLocation(String legFile) {
        RestAssured.baseURI="http://localhost:8080/leos-pilot/api/";
        Map<String, String> headers = new HashMap<>();
        headers.put("Authorization", "Bearer " + context.getValue("accessToken"));
        request = RestAssured.given().headers(headers).multiPart("legFile", new File(ClassLoader.getSystemResource(legFile).getFile()));
        response = request.post("/secured/proposal/upload");
    }

    @Then("status code of upload api response is {int}")
    public void statusCodeOfUploadApiResponseIs(int statusCode) {
        int responseCode = response.getStatusCode();
        assertEquals(responseCode, statusCode);
    }

    @When("run validateLegFile api with a leg file from a relative location {string}")
    public void runValidateApiWithALegFileFromARelativeLocation(String legFile) {
        RestAssured.baseURI="http://localhost:8080/leos-pilot/api/";
        Map<String, String> headers = new HashMap<>();
        headers.put("Authorization", "Bearer " + context.getValue("accessToken"));
        request = RestAssured.given().headers(headers).multiPart("legFile", new File(ClassLoader.getSystemResource(legFile).getFile()));
        response = request.post("/secured/proposal/validateLegFile");
    }

    @Then("status code of validateLegFile api response is {int}")
    public void statusCodeOfValidateApiResponseIs(int statusCode) {
        int responseCode = response.getStatusCode();
        assertEquals(responseCode, statusCode);
    }

    @And("response body of validateLegFile api contains key {string} and value null")
    public void validateLegFileApiContainsKeyAndValueNull(String key) {
        String value = response.jsonPath().getString(key);
        assertNull(value);
    }
}
