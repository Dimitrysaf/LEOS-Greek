#Author: Satyabrata Das
#Keywords Summary : Testing for different functionalities in Repository Browser Page in Drafting instance of Edit Application
@RepositoryBrowserPageRegressionScenariosEditCommission
Feature: Repository Browser Page Regression Features in Edit Commission

  @uploadFileNotPresentForNonSupportUser
  Scenario: upload button is not present in repository browser page for non support user
    Given navigate to "Drafting" application
    Then  user is on EU login page
    When  user enters username "user.nonsupport.1.name"
    And   user clicks next button
    Then  user is on login page
    When  user enters password "user.nonsupport.1.pwd"
    And   user clicks on sign in button
#    Then  user is on home page
#    When  user clicks on view all acts button
    Then  user is on repository browser page
    And   create proposal button is displayed and enabled
    And   upload button is not present


  @filterSection
  Scenario: upload button is not present in repository browser page for non support user
    Given navigate to "Drafting" application
    Then  user is on EU login page
    When  user enters username "user.support.1.name"
    And   user clicks next button
    Then  user is on login page
    When  user enters password "user.support.1.pwd"
    And   user clicks on sign in button
#    Then  user is on home page
#    When  user clicks on view all acts button
    Then  user is on repository browser page
    And   upload button is displayed and enabled
    And   create proposal button is displayed and enabled
    And   filter section is displayed
    And   search text box is present in filter section
    And   search button is present in filter section
    And   reset button is present in filter section
    And   below procedures are present in filter section
      | Ordinary legislative procedure |
      | Special legislative procedure  |
      | Commission legal acts          |
      | Council legal acts             |
    And   below acts are present in filter section
      | Proposal for a regulation       |
      | Proposal for a directive        |
      | Proposal for a decision         |
      | Proposal for a Council decision |
    And   below templates are present in filter section
      | SJ-023 - Proposal for a Regulation of the European Parliament and of the Council                    |
      | SJ-024 - Proposal for a Directive of the European Parliament and of the Council                     |
      | SJ-025 - Proposal for a Decision of the European Parliament and of the Council                      |
      | SJ-026 - Proposal for a Decision of the European Parliament and of the Council (without addressees) |
      | SJ-019 - Proposal for a Council Decision                                                            |
    And   below role are present in filter section
      | Author      |
      | Contributor |
      | Reviewer    |
      | Support     |
      | Admin       |
      | User        |