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
    When create an entity by giving a name "test custom.entity (123)"
    Then show the successful message that a new entity is created
    Then verify the new entity presence on the table

  @entityUpdateWithInvalidData @local
  Scenario: entity update should fail when name contains invalid characters
    When click on manage users and entities link under administration dropdown
    Then select manage entities tab
    When search and click on entity "test custom.entity (123)"
    Then custom entity info section should be displayed
    When click on edit button
    When verify entity update fails if name contains invalid data
      | invalidName   |
      | entity&name   |
      | entity@name   |
      | entity (name  |
      | entity. name  |

  @updatingExistingEntityName @local
  Scenario: updating the name of an existing entity
    When click on manage users and entities link under administration dropdown
    Then select manage entities tab
    When search and click on entity "test custom.entity (123)"
    Then custom entity info section should be displayed
    When click on edit button
    And  update the entity name to "test custom.entity (123)_updated"
    And  click on save button
    Then show the successful message that entity is updated
    Then verify the updated entity presence on the table
    When search and click on entity "test custom.entity (123)_updated"
    Then custom entity info section should be displayed
    When click on edit button
    And  update the entity name to "test custom.entity (123)"
    And  click on save button
    Then show the successful message that entity is updated
    Then verify the updated entity presence on the table

  @addingNewUserToExistingEntity @verifyingRestrictionOnUserDeletion @verifyingRestrictionOnEntityDeletion @local
  Scenario: creating new user and verifying user and entity deletion is blocked when associated
    When click on manage users and entities link under administration dropdown
    Then add user button should be displayed
    When click on add user button
    Then user info section should be displayed
    When fill the user info details
      | firstName | lastName | email          | userLogin |
      | firstuser | lastuser | first@last.com | firstLast |
    And  search and assign the entities '["AGRI", "test custom.entity (123)"]' to the user
    And  click on save button
    Then show the successful message that a new user is created
    Then verify the new user details on the table
    Then click on delete button for user
    Then error popup should be displayed as entity is associated with the user
    Then verify the user "firstLast" is still present on the table
    Then select manage entities tab
    When search and click on entity "test custom.entity (123)"
    Then custom entity info section should be displayed
    When click on delete entity button
    Then error popup should be displayed as user is associated with the entity
    Then verify the entity "test custom.entity (123)" is still present on the table

  @userCreationWithMissingMandatoryField @local
  Scenario: user creation should fail when a mandatory field is not filled
    When click on manage users and entities link under administration dropdown
    Then add user button should be displayed
    When click on add user button
    Then user info section should be displayed
    When verify user creation fails without entities
      | firstName | lastName | email          | userLogin |
      | firstuser | lastuser | first@last.com | noentities |
    And  search and assign the entities '["AGRI", "test custom.entity (123)"]' to the user
    When verify user creation fails if mandatory field is empty
      | firstName  | lastName | email          | userLogin |
      | firstuser  | lastuser | first@last.com | badvalues |

  @userCreationWithInvalidFieldData @local
  Scenario: user creation should fail when fields have invalid values
    When click on manage users and entities link under administration dropdown
    Then add user button should be displayed
    When click on add user button
    Then user info section should be displayed
    And  search and assign the entities '["AGRI", "test custom.entity (123)"]' to the user
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
    And  click on save button
    Then show the successful message that user is updated
    Then verify the updated user details on the table
    When search and click on user with login "firstLast"
    Then verify the updated email in user info section

  @verifyPinkBackgroundWhenCollaboratorDeletedOrEntityDeleted @local
  Scenario: create an act and add a collaborator
    When click on Create act button
    Then user is on create new legislative document window
    When click on template "SJ-023" in create new legislative document window
    And click on next button in create document page
    And tick guidance approval checkbox in create document page
    And click on next button in create document page
    And provide document title "User Management Act 1" in create document page
    And click on create button
    Then user is on act viewer page
    And click on manage users and entities link under administration dropdown
    And search and click on user with login "firstLast"
    And click on edit button
    And remove the entities '["test custom.entity (123)"]' and update the user form
    And click on home button
    And click on view all acts button
    And provide "User Management Act 1" keyword in search for an act input box in workspace
    And click on act 1
    Then user is on act viewer page
    And click on collaborators tab in act view page
    When click on add button in collaborators tab
    And provide input "firstEdited" in name field of add users window
    And click on row 1 from the user list in name field of add users window
    And select role with value "OWNER" in add users window
    And click on add users button
    Then user name "lastEdited firstEdited" is added as collaborator
    And click on three vertical dots for user "DOE Jane" in collaborators tab
    And click on delete role button
    And click on danger button in dialog box window
    And click on manage users and entities link under administration dropdown
    And search and click on user with login "firstLast"
    And click on edit button
    And remove the entities '["AGRI"]' and update the user form
    When click on home button
    And click on view all acts button
    And provide "User Management Act 1" keyword in search for an act input box in workspace
    And click on act 1
    Then user is on act viewer page
    And click on collaborators tab in act view page
    Then background color of row with username "lastEdited firstEdited" is pink
    Then the entity is not present for collaborator "lastEdited firstEdited"
    When mousehover on entity column of user "lastEdited firstEdited"
    Then tooltip contains "Entity association for collaborator could not be found. Please remove the collaborator and re-add him with the correct entity or contact EdiT support."
    When click on manage users and entities link under administration dropdown
    And search user with login "firstLast"
    And click on delete button for user
    Then confirm the user deletion for "lastEdited" "firstEdited" "firstLast"
    When click on home button
    And click on view all acts button
    And provide "User Management Act 1" keyword in search for an act input box in workspace
    And click on act 1
    Then user is on act viewer page
    And click on collaborators tab in act view page
    Then background color of row with username "lastEdited firstEdited" is pink
    
  @entityDeletionAllowedWhenNoUserAssociated @local
  Scenario: entity deletion should be allowed when there is no user associated
    When click on manage users and entities link under administration dropdown
    Then select manage entities tab
    When search and click on entity "test custom.entity (123)"
    Then custom entity info section should be displayed
    When click on delete entity button
    Then confirm the entity deletion for "test custom.entity (123)"
    Then verify the entity "test custom.entity (123)" is no longer present on the table

  @comrefUserNotEditableAndNotDeletable @local
  Scenario: COMREF user should not be editable and deletable
    When click on manage users and entities link under administration dropdown
    Then add user button should be displayed
    When search user with login "jane"
    Then verify the row with "COMREF" text is present and its tooltip in the user table
    When click on user login "jane" in the COMREF row
    Then user info section should be displayed
    Then edit button is not present
