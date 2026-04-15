#Author: Prabu Nallavedi
#Keywords Summary : Testing different functionalities of 'Users and Management Entities'.

@userManagementScenarios
Feature: User Management Entities Regression Features

  Background:
    Given navigate to leos application with "User1"
    Then user is on home page

  @addingNewUser @local
  Scenario: creating new user and assigning existing entities to the user
    When click on manage users and entities link under administration dropdown
    Then add user button should be displayed
    When click on add user button
    Then user info section should be displayed
    When fill the user info details
    |firstName|lastName|email|userLogin|
    |firstuser|lastuser|first@last.com|firstLast|
    And  search and assign the entities '["AGRI", "COM"]' to the user
    And  click on save button
    Then show the successful message that a new user is created
    Then verify the new user details on the table