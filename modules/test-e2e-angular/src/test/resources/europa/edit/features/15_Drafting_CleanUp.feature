#Author: Satyabrata Das
#Keywords Summary : Cleaning up Features
@cleanUpCommission
Feature: Clean Up Features

  @cleanUpProposalCommission
  Scenario Outline: LEOS-4904 [EC] Delete all proposal created by Automation
    Given navigate to "Drafting" application
    Then  user is on EU login page
    When  user enters username "<username>"
    And   user clicks next button
    Then  user is on login page
    When  user enters password "<password>"
    And   user clicks on sign in button
    Then  user is on repository browser page
    And   delete all the proposal containing keyword
      | Automation               |
    Examples:
      | username               | password              |
      | user.support.1.name    | user.support.1.pwd    |
      | user.nonsupport.1.name | user.nonsupport.1.pwd |