#Author: Sapna Khandelwal
#Keywords Summary : Testing different functionalities related to Custom Template.

@CustomTemplate
Feature: Custom Template regression features

  @CreationOfCustomTemplate @local @focus
  Scenario:Creation Of custom template and publish milestone and validate published and unpublished status
    #Creation Of Custom Template
    Given navigate to leos application with "User1"
    Then user is on home page
    When click on Create act button
    Then user is on create new legislative document window
    When click on template "SJ-003" in create new legislative document window
    When click on next button in create document page
    And  provide document title "CreationOfCustomTemplate" in create document page
    When tick custom template checkbox in create document page
    And  click on create button
    Then user is on act viewer page
    And  chip content container 1 of act header contains "Custom Template"

    #Published one milestone and published  is visibled in in act view as well as milestonee tab
    When click on milestones tab in act view page
    And click on add button in milestones tab
    When click on milestone type dropdown
    When click on option "Custom Template" from milestone type dropdown
    And  click on create milestone button
    Then successful message contains "Milestone created"
    And  "File ready" is showing under status column of row 1 of milestones table
    When click on three dots under actions column of row 1 of milestones table
    When click on option "Publish to DG template catalog" under milestone actions
    Then "Add to catalog" dialog box window is displayed
    And publish to catalog button is disabled in add to catalog window
    When add "Food safety" in template name textBox
    And publish to catalog button is enabled in add to catalog window
    When click on publish to catalog button
    And  chip content container 1 of act header contains "Custom Template"
    And  chip content container 2 of act header contains "Published"
    And  "Published" is showing under status column of row 1 of milestones table
    When click on workspace button in breadcrumb item
    Then user is on repository browser page
    Then label container 1 of act 1 header contains " Custom Template "
    And  label container 2 of act 1 header contains " Published "
    When click on act 1
    #Create one more milestone and publish it and validate the previous published milestone status to un published
    Then user is on act viewer page
    When click on add button in annexes section
    Then total number of annexes present in act viewer page is 1
    When click on milestones tab in act view page
    And click on add button in milestones tab
    When click on milestone type dropdown
    When click on option "Custom Template" from milestone type dropdown
    And  click on create milestone button
    Then successful message contains "Milestone created"
    And  "File ready" is showing under status column of row 1 of milestones table
    When click on three dots under actions column of row 1 of milestones table
    When click on option "Publish to DG template catalog" under milestone actions
    Then "Add to catalog" dialog box window is displayed
    When click on publish to catalog button
    And  "Published" is showing under status column of row 1 of milestones table
    And  "Unpublished" is showing under status column of row 2 of milestones table
    When click on three dots under actions column of row 1 of milestones table
    When click on option "View" under milestone actions
    Then user is on milestone explorer window
    And the milestone type should be " Custom Template"
    And  milestone explorer window contains below tabs
      | TabName                              |
      | Explanatory Memorandum  [1.0.0]      |
      | Legal Act  [2.0.0]                   |
      | Annex 1  [1.0.0]    |
    #Unpublish to publish and vaildate through milestone tab
    When click on close button in milestone explorer view
    Then user is on act viewer page
    When click on three dots under actions column of row 2 of milestones table
    When click on option "Publish to DG template catalog" under milestone actions
    Then "Add to catalog" dialog box window is displayed
    When click on publish to catalog button
    And  "Published" is showing under status column of row 1 of milestones table
    When click on three dots under actions column of row 1 of milestones table
    When click on option "View" under milestone actions
    Then user is on milestone explorer window
    And  milestone explorer window contains below tabs
      | TabName                              |
      | Explanatory Memorandum  [1.0.0]      |
      | Legal Act  [1.0.0]                   |
    When click on close button in milestone explorer view
    Then user is on act viewer page
    And  "Unpublished" is showing under status column of row 2 of milestones table
    When click on three dots under actions column of row 2 of milestones table
    When click on option "View" under milestone actions
    Then user is on milestone explorer window
    And  milestone explorer window contains below tabs
      | TabName                              |
      | Explanatory Memorandum  [1.0.0]      |
      | Legal Act  [2.0.0]                   |
      | Annex 1  [1.0.0]    |
    When click on close button in milestone explorer view
    Then user is on act viewer page

    #Template  Visibility :
    When click on add button in annexes section
    Then total number of annexes present in act viewer page is 1
    When click on milestones tab in act view page
    And click on add button in milestones tab
    When click on milestone type dropdown
    When click on option "Custom Template" from milestone type dropdown
    And  click on create milestone button
    Then successful message contains "Milestone created"
    And  "File ready" is showing under status column of row 1 of milestones table
    When click on three dots under actions column of row 1 of milestones table
    When click on option "Publish to DG template catalog" under milestone actions