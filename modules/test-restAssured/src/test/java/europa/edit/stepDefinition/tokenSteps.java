package europa.edit.stepDefinition;

import europa.edit.util.ScenarioContext;
import io.cucumber.java.en.And;
import io.cucumber.java.en.Given;
import io.cucumber.java.en.Then;
import io.restassured.RestAssured;
import io.restassured.response.Response;
import io.restassured.specification.RequestSpecification;

import java.util.HashMap;
import java.util.Map;

import static org.testng.Assert.assertEquals;
import static org.testng.Assert.assertNotNull;


public class tokenSteps {


    private ScenarioContext context;
    private Response response;

    public tokenSteps(ScenarioContext context) {
        this.context = context;
    }

    @Given("generate token")
    public void generateToken() {
        RestAssured.baseURI="http://localhost:8080/leos-pilot/api/";
        Map<String, String> headers = new HashMap<>();
        headers.put("Grant-Type", "jwt-bearer");
        headers.put("Assertion", "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhdWQiOm51bGwsIm5iZiI6MTc1NjMxNDkzMSwiaXNzIjoibmdMZW9zQ2xpZW50SWQiLCJleHAiOjIyMjk2ODU1NDUxLCJpYXQiOjE3NTYzMTQ5MzEsInVzZXIiOiJqYW5lIiwic3lzdGVtQ2xpZW50SWQiOiJuZ0xlb3NDbGllbnRJZCJ9.XmQFi9k0HSe-SP8MTHmCJ455fYnhQK86BwSpPh8lHY0");
        RequestSpecification request = RestAssured.given().headers(headers);
        response = request.get("token");
    }

    @Then("status code of token api response is {int}")
    public void statusCodeOfTokenApiResponseIs(int statusCode) {
        int responseCode = response.getStatusCode();
        assertEquals(responseCode, statusCode);
    }

    @And("token api response contains key {string}")
    public void tokenApiResponseContainsKey(String key) {
        String accessToken = response.jsonPath().getString(key);
        assertNotNull(accessToken);
        context.setValue("accessToken", accessToken);
    }

    @And("token api response contains key {string} and value {string}")
    public void tokenApiResponseContainsKeyAndValue(String key, String value) {
        String actualValue = response.jsonPath().getString(key);
        assertEquals(actualValue, value);
    }
}