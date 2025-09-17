#Author: Satyabrata Das
#Keywords Summary : Testing for different scenarios for createPackage Api
@workSpaceApiFeature
Feature: workspace api feature

  Background:
    Given generate token
    Then  status code of token api response is 200
    And   token api response contains key "accessToken"
    And   token api response contains key "tokenType" and value "jwt"

  @createPackage @validateProposal
  Scenario: user is able to create an act successfully
    When create an act with following request body
    """
    {
      "templateId": null,
      "templateName": "SJ-023 - Proposal for a Regulation of the European Parliament and of the Council",
      "langCode": "EN",
      "docPurpose": "on ...create proposal",
      "eeaRelevance": false,
      "key": "SJ-023"
    }
    """
    Then status code of createPackage api response is 200
    And  createPackage api response contains below keys with value not null
      | proposalId  |
      | proposalUrl |
