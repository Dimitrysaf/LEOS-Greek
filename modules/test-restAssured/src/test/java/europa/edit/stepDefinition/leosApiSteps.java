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


public class leosApiSteps {

    private ScenarioContext context;
    RequestSpecification request;
    private Response response;

    public leosApiSteps(ScenarioContext context) {
        this.context = context;
    }

    @When("run getCurrentUser api for current user")
    public void runGetCurrentUserApiForCurrentUser() {
        RestAssured.baseURI="http://localhost:8080/leos-pilot/api/";
        Map<String, String> headers = new HashMap<>();
        headers.put("Authorization", "Bearer " + context.getValue("accessToken"));
        request = RestAssured.given().headers(headers);
        response = request.get("/secured/users/current");
        System.out.println(response.getBody().asString());
    }

    @Then("status code of getCurrentUser api response is {int}")
    public void statusCodeOfCreatePackageApiResponseIs(int statusCode) {
        int responseCode = response.getStatusCode();
        assertEquals(responseCode, statusCode);
    }
}
