#Author: Satyabrata Das
#Keywords Summary : Testing different functionalities in collaborator section in drafting instance

@CollaboratorScenarios
Feature: collaborator section regression features

  @reviewerRoleAccess @local
  Scenario: User with reviewer role should not edit TOC or action menu
    Given navigate to edit drafting application with "User1"
    Then user is on home page
    When click on create proposal button
    Then user is on create new legislative document window
    When click on template "SJ-023" in create new legislative document window
    When click on next button in create document page
    And  provide document title "Reviewer role access testing" in create document page
    And  click on create button
    Then user is on proposal viewer page
    When click on legal act link present in proposal viewer page
    Then user is on legal act page
    And  toc editing button is displayed and enabled
    And  ribbon toolbar is displayed
    When click on insert after icon of citation 1
    Then citation 2 is displayed
    When click on versions pane accordion
    Then subversion 1 of recent changes version card contains "0.1.1 inserted"
    When click on three vertical dots of card header title "Version 0.1.0 - Document created" in version pane
    Then only below options are displayed in dropdown content
      | dropdownContent        |
      | View this version      |
      | Revert to this version |
      | Export this version    |
    When click on close button present in legal act page
    Then user is on proposal viewer page
    When click on collaborators tab in proposal view page
    Then active tab name is "Collaborators"
    When click on add button in collaborators tab
    Then user is on "Add users" window
    When provide input "demo" in name field of add users window
    And  click on row 1 from the user list in name field of add users window
    And  select role with value "REVIEWER" in add users window
    And  click on add users button
    Then "DEMO Demo" is displayed in row 2 of column name of collaborators tab
    And  "Reviewer" is displayed in row 2 of column role of collaborators tab
    Given navigate to edit drafting application with "User3"
    Then  user is on home page
    When  click on view all acts button
    Then  user is on repository browser page
    And   name of proposal 1 contains "Reviewer role access testing"
    When  click on proposal 1
    Then  user is on proposal viewer page
    When  click on legal act link present in proposal viewer page
    Then  user is on legal act page
    And   ribbon toolbar is displayed
    And   toc editing button is not present
    And   show all action menu is not present for citation 1
    And   show all action menu is not present for recital 1
    When  click on versions pane accordion
    Then  subversion 1 of recent changes version card contains "0.1.1 inserted"
    When  click on three vertical dots of card header title "Version 0.1.0 - Document created" in version pane
    Then  only below options are displayed in dropdown content
      | dropdownContent     |
      | View this version   |
      | Export this version |