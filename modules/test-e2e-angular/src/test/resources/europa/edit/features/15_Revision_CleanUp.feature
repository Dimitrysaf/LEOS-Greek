#Author: Satyabrata Das
#Keywords Summary : Cleaning up Features
@CleanUpScenarios
Feature: Clean Up Features

  @cleanUpProposalCouncil
  Scenario Outline: LEOS-4904 [EC] Delete all proposal created by Automation
    Given navigate to "Revision" application
    Then  user is on EU login page
    When  user enters username "<username>"
    And   user clicks next button
    Then  user is on login page
    When  user enters password "<password>"
    And   user clicks on sign in button
    Then  user is on repository browser page
    And   delete all the mandate containing keyword
      | Regression |
      | Automation |
    Examples:
      | username               | password              |
      | user.support.1.name    | user.support.1.pwd    |
      | user.nonsupport.1.name | user.nonsupport.1.pwd |