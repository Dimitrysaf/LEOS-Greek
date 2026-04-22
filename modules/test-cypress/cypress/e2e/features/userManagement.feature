#Author: Prabu Nallavedi
#Keywords Summary : Testing different functionalities of 'Users and Management Entities'.

@userManagementScenarios
Feature: User Management Entities Regression Features

  Background:
    Given navigate to leos application with "User1"
    Then user is on home page

  @addingNewEntity @local
  Scenario: creating a new custom entity
    When click on manage users and entities link under administration dropdown
    Then select manage entities tab
    Then add entity button should be displayed
    When click on add entity button
    Then custom entity info section should be displayed
    When create an entity by giving a name "test_custom_entity"
    Then show the successful message that a new entity is created
    Then verify the new entity presence on the table

  @addingNewUserToExistingEntity @local
  Scenario: creating new user and assigning existing entities to the user
    When click on manage users and entities link under administration dropdown
    Then add user button should be displayed
    When click on add user button
    Then user info section should be displayed
    When fill the user info details
    |firstName|lastName|email|userLogin|
    |firstuser|lastuser|first@last.com|firstLast|
    And  search and assign the entities '["AGRI", "test_custom_entity"]' to the user
    And  click on save button
    Then show the successful message that a new user is created
    Then verify the new user details on the table
  
  @userCreationWithMissingMandatoryField @local
  Scenario Outline: user creation should fail when mandatory field "<missingField>" is not filled
    When click on manage users and entities link under administration dropdown
    Then add user button should be displayed
    When click on add user button
    Then user info section should be displayed
    When fill the user info details except "<missingField>"
      |firstName|lastName|email|userLogin|
      |firstuser|lastuser|first@last.com|firstLast|
    And  click on save button
    Then error popup should be displayed for user creation

    Examples:
      | missingField |
      | firstName    |
      | lastName     |
      | email        |
      | userLogin    |

  @userCreationWithInvalidFieldData @local @focus
  Scenario Outline: user creation should fail when "<fields>" has invalid value "<invalidValue>"
    When click on manage users and entities link under administration dropdown
    Then add user button should be displayed
    When click on add user button
    Then user info section should be displayed
    When fill the user info "<fields>" with "<invalidValue>"
      |firstName|lastName|email|userLogin|
      |firstuser|lastuser|first@last.com|firstLast|
    And  click on save button
    Then error popup should be displayed for user creation

    Examples:
      | fields    | invalidValue       |
      | firstName | first(user         |
      | firstName | first[user]        |
      | firstName | first/user         |
      | firstName | first\\user        |
      | firstName | first&user         |
      | lastName  | last{user}         |
      | lastName  | last?user          |
      | lastName  | last\|user         |
      | lastName  | last(user)         |
      | lastName  | last#user          |
      | userLogin | user.login         |
      | userLogin | user-login         |
      | userLogin | user@login         |
      | userLogin | user login         |
      | email     | missingAtSign      |
      | email     | user@              |
      | email     | @domain.com        |