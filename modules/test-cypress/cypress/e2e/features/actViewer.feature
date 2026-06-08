#Author: Satyabrata Das
#Keywords Summary : Testing different functionalities in act viewer page in drafting instance#

@ProposalViewerScenarios
Feature: act viewer page Regression Features

  Background:
    Given navigate to leos application with "User1"
    Then user is on home page
    When click on Create act button
    Then user is on create new legislative document window
    When click on template "SJ-023" in create new legislative document window
    When click on next button in create document page
    When tick guidance approval checkbox in create document page
    When click on next button in create document page
    When provide document title "Automation Testing" in create document page
    When click on create button
    Then user is on act viewer page

  @createMilestone @local
  Scenario: verify that user is able to create milestone
    When click on details tab in act view page
    Then active tab name is "Details"
    And  template name is "SJ-023" in details tab
    And  confidentiality level is "STANDARD" in details tab
    And  EEA Relevance is unticked in details tab
    When click on milestones tab in act view page
    When  click on add button in milestones tab
    Then add milestone window is displayed
    Then  "For Interservice Consultation" option is selected by default
    Then  milestone title textBox is disabled
    When click on milestone type dropdown
    When click on option "Other" from milestone type dropdown
    Then milestone title textBox is enabled
    When  type "Commission act" in milestone title textBox
    When click on create milestone button
    Then successful message contains "Milestone created"
    Then  "Commission act" is showing under title column of row 1 of milestones table
    Then  "File ready" is showing under status column of row 1 of milestones table

  @verifyXmlInsideDownloadedLegFile @verifyExportButtonsPresent @local
  Scenario: verify name of xmls present inside downloaded leg file
    When click on add button in annexes section
    Then total number of annexes present in act viewer page is 1
    When click on add button in annexes section
    Then total number of annexes present in act viewer page is 2
    When click on actions button
    Then below buttons are present under actions dropdown
      | buttonName           |
      | Download             |
      | Export as PDF        |
      | Export as Legiswrite |
      | Validate             |
      | Copy/Change act      |
      | Delete act           |
    When click on download button
    When  extract recent "zip" file present in download folder
    When  extract recent "leg" file present in download folder
    Then xml files having separator "-" present in download folder contain below names
      | fileName                |
      | STAT_DIGIT_FINANC_LEGIS |
      | ANNEX                   |
      | ANNEX                   |
      | EXPL_MEMORANDUM         |
      | main                    |
      | REG                     |
#https://code.europa.eu/leos/core/-/work_items/3697
# https://code.europa.eu/leos/core/-/work_items/3735
  @copyAndChangeAct @local
  Scenario: Verify after adding annex able to copy the act.
    When click on add button in annexes section
    Then total number of annexes present in act viewer page is 1
    When click on actions button
    And click on copy change button from action menu
    Then user is on create new legislative document window
    Then the following radio button options are displayed in create new legislative document window
      | ChangeCopyAct                 |
      | Keep the type of the act      |
      | Change the type of the act to |
    And "Keep the type of the act" is checked
    And "Change the type of the act to" is unchecked
    When user selects the option "Change the type of the act to" in create new legislative document window
    Then "Keep the type of the act" is unchecked
    When click on template "SJ-024" in create new legislative document window
    And click on next button in create document page
    Then all radio button options are disabled
    And "Change the type of the act to" is checked
    When tick guidance approval checkbox in create document page
    And click on next button in create document page
    Then document title is "Automation Testing-copy" in create document page
    When click on create button
    Then title of the act contains "Automation Testing-copy" keyword
    And total number of annexes present in act viewer page is 1