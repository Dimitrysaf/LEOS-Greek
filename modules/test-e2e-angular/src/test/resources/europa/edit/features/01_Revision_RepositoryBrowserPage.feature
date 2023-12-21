#Author: Satyabrata Das
#Keywords Summary : Testing for different functionalities in Repository Browser Page in Revision instance of Edit Application
@RepositoryBrowserPageRegressionScenariosEditRevision
Feature: Repository Browser Page Regression Features in Edit Revision

  @resetFilter
  Scenario: Verify user is able to reset filter, search mandate and open proposal by using double click
    Given navigate to "Revision" application
    Then  user is on EU login page
    When  user enters username "user.support.1.name"
    And   user clicks next button
    Then  user is on login page
    When  user enters password "user.support.1.pwd"
    And   user clicks on sign in button
    Then  user is on repository browser page
    And   user name is present in the top right upper corner
    And   filter section is displayed
    And   search text box is present in filter section
    And   search button is present in filter section
    And   create mandate button is displayed and enabled
    And   create draft button is displayed and enabled
    And   proposals list is displayed
    When  tick "acts-DIRECTIVE OF THE EUROPEAN PARLIAMENT AND OF THE COUNCIL" in filter section
    Then  "acts-DIRECTIVE OF THE EUROPEAN PARLIAMENT AND OF THE COUNCIL" is ticked in filter section
    When  click on reset button
    Then  "acts-DIRECTIVE OF THE EUROPEAN PARLIAMENT AND OF THE COUNCIL" is unTicked in filter section
    When  click on proposal 1
    Then  user is on overview screen
    When  click on home link present in breadcrumb
    Then  user is on repository browser page