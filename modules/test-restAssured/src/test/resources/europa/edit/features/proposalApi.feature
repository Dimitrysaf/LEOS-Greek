#Author: Satyabrata Das
#Keywords Summary : Testing for different scenarios for createPackage Api
@proposalApiFeature
Feature: proposal api feature

  Background:
    Given generate token
    Then  status code of token api response is 200
    And   token api response contains key "accessToken"
    And   token api response contains key "tokenType" and value "jwt"

  @uploadAct
  Scenario: user is able to create an act by uploading a leg file
    When run upload api with a leg file from a relative location "files/PROP_ACT-3210011215583606762-EN.leg"
    Then status code of upload api response is 200

  @validateLegFile
  Scenario: user is able to validate the leg file
    When run validateLegFile api with a leg file from a relative location "files/PROP_ACT-3210011215583606762-EN.leg"
    Then status code of validateLegFile api response is 200
    And  response body of validateLegFile api contains key "error" and value null
