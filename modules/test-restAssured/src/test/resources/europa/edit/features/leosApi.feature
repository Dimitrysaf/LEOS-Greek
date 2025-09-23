#Author: Satyabrata Das
#Keywords Summary : Testing for different scenarios for apis used in leos
@leoApiFeature
Feature: leos api feature

  Background:
    Given generate token
    Then  status code of token api response is 200
    And   token api response contains key "accessToken"

  @getCurrentUser
  Scenario: get the current user's details
    When run getCurrentUser api for current user
    Then status code of getCurrentUser api response is 200