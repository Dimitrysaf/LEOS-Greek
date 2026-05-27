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

  @entityUpdateWithInvalidData @local
  Scenario: entity update should fail when name contains invalid characters
    When click on manage users and entities link under administration dropdown
    Then select manage entities tab
    When search and click on entity "test_custom_entity"
    Then custom entity info section should be displayed
    When click on edit button
    When verify entity update fails if name contains invalid data
      | invalidName   |
      | entity&name   |
      | entity@name   |
      | entity name   |

  @updatingExistingEntityName @local
  Scenario: updating the name of an existing entity
    When click on manage users and entities link under administration dropdown
    Then select manage entities tab
    When search and click on entity "test_custom_entity"
    Then custom entity info section should be displayed
    When click on edit button
    And  update the entity name to "test_custom_entity_updated"
    And  click on save button
    Then show the successful message that entity is updated
    Then verify the updated entity presence on the table
    When search and click on entity "test_custom_entity_updated"
    Then custom entity info section should be displayed
    When click on edit button
    And  update the entity name to "test_custom_entity"
    And  click on save button
    Then show the successful message that entity is updated
    Then verify the updated entity presence on the table

  @addingNewUserToExistingEntity @verifyingRestrictionOnUserDeletion @local
  Scenario: creating new user and assigning existing entities to the user and verifying user deletion is blocked
    When click on manage users and entities link under administration dropdown
    Then add user button should be displayed
    When click on add user button
    Then user info section should be displayed
    When fill the user info details
      | firstName | lastName | email          | userLogin |
      | firstuser | lastuser | first@last.com | firstLast |
    And  search and assign the entities '["AGRI", "test_custom_entity"]' to the user
    And  click on save button
    Then show the successful message that a new user is created
    Then verify the new user details on the table
    Then click on delete button for user "firstLast"
    Then error popup should be displayed as entity is associated with the user
    Then verify the user "firstLast" is still present on the table

  @userCreationWithMissingMandatoryField @local
  Scenario: user creation should fail when a mandatory field is not filled
    When click on manage users and entities link under administration dropdown
    Then add user button should be displayed
    When click on add user button
    Then user info section should be displayed
    When verify user creation fails without entities
      | firstName | lastName | email          | userLogin |
      | firstuser | lastuser | first@last.com | noentities |
    And  search and assign the entities '["AGRI", "test_custom_entity"]' to the user
    When verify user creation fails if mandatory field is empty
      | firstName  | lastName | email          | userLogin |
      | firstuser  | lastuser | first@last.com | badvalues |

  @userCreationWithInvalidFieldData @local
  Scenario: user creation should fail when fields have invalid values
    When click on manage users and entities link under administration dropdown
    Then add user button should be displayed
    When click on add user button
    Then user info section should be displayed
    And  search and assign the entities '["AGRI", "test_custom_entity"]' to the user
    When verify user creation fails if any field contains invalid data
      | fields    | invalidValue  |
      | firstName | first(user    |
      | firstName | first[user]   |
      | firstName | first/user    |
      | firstName | first\\user   |
      | firstName | first&user    |
      | lastName  | last{user}    |
      | lastName  | last?user     |
      | lastName  | last\|user    |
      | lastName  | last(user)    |
      | lastName  | last#user     |
      | userLogin | user.login    |
      | userLogin | user-login    |
      | userLogin | user@login    |
      | userLogin | user login    |
      | email     | missingAtSign |
      | email     | user@         |
      | email     | @domain.com   |

  @updatingExistingUserDetails @local
  Scenario: updating the details of an existing user
    When click on manage users and entities link under administration dropdown
    Then add user button should be displayed
    When search and click on user with login "firstLast"
    Then user info section should be displayed
    When click on edit button
    And  update the user info details
      | firstName   | lastName   | email             |
      | firstEdited | lastEdited | updated@email.com |
    And  select and remove the entities '["AGRI", "test_custom_entity"]' from the user
    And  click on save button
    Then show the successful message that user is updated
    Then verify the updated user details on the table
    When search and click on user with login "firstLast"
    Then verify the updated email in user info section
    And  verify the entities '["AGRI", "test_custom_entity"]' are removed from the user

  @deletingUserSuccessfully @local
  Scenario: deleting a user successfully after removing associated entities
    When click on manage users and entities link under administration dropdown
    Then add user button should be displayed
    When search user with login "firstLast"
    And  click on delete button for user "firstLast"
    Then confirm the user deletion for "lastEdited" "firstEdited" "firstLast"
    Then verify the user "firstLast" is no longer present on the table