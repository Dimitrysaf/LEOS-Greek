#Author: Satyabrata Das
#Keywords Summary : Testing different functionalities in act viewer page in drafting instance

@ProposalViewerScenarios
Feature: act viewer page Regression Features

  Background:
    Given navigate to edit drafting application with "User1"
    Then user is on home page
    When click on Create act button
    Then user is on create new legislative document window
    When click on template "SJ-023" in create new legislative document window
    When click on next button in create document page
    And  provide document title "Automation Testing" in create document page
    And  click on create button
    Then user is on act viewer page

  @createMilestone @local @focus
  Scenario: verify that user is able to create milestone
    Given click on details tab in act view page
    Then active tab name is "Details"
    And  template name is "SJ-023" in details tab
    And  language is "EN" in details tab
    And  confidentiality level is "STANDARD" in details tab
    And  EEA Relevance is unticked in details tab
    When click on milestones tab in act view page
    And  click on add button in milestones tab
    Then add milestone window is displayed
    And  "For Interservice Consultation" option is selected by default
    And  milestone title textBox is disabled
    When click on milestone type dropdown
    When click on option "Other" from milestone type dropdown
    Then milestone title textBox is enabled
    And  type "Commission act" in milestone title textBox
    When click on create milestone button
    Then successful message contains "Milestone created"
    And  "Commission act" is showing under title column of row 1 of milestones table
    And  "File ready" is showing under status column of row 1 of milestones table

  @verifyXmlInsideDownloadedLegFile @local
  Scenario: verify name of xmls present inside downloaded leg file

    When click on add button in annexes section
    Then total number of annexes present in act viewer page is 1
    When click on add button in annexes section
    Then total number of annexes present in act viewer page is 2
    When click on actions button
    And  click on download button
    And  extract recent "zip" file present in download folder
    And  extract recent "leg" file present in download folder
    Then xml files having separator "-" present in download folder contain below names
      | fileName                |
      | STAT_DIGIT_FINANC_LEGIS |
      | ANNEX                   |
      | ANNEX                   |
      | EXPL_MEMORANDUM         |
      | main                    |
      | REG                     |

  @verifyExportButtonsPresent @local
  Scenario: verify export buttons are present
    When click on add button in annexes section
    Then total number of annexes present in act viewer page is 1
    When click on add button in annexes section
    Then total number of annexes present in act viewer page is 2
    When click on actions button
    Then export as pdf button is present
    Then export as legiswrite button is present

  @verifyChangeTitleFunctionalityFromAnnex @local
  Scenario: VerifyChangeTitleFunctionality
    When click on add button in annexes section
    Then total number of annexes present in act viewer page is 1
    And user can change the name of the annex by click the actions button
    When user click on Title change from actions menu
    Then one Edit title dialogue box will be displayed
    And user can clear the previous title
    And the user can change title of the annex to "Annex1"
    And user can save the changes

  @verifyDeleteFunctionalityFromAnnex @local
  Scenario: DeleteFunctionality
    When click on add button in annexes section
    Then total number of annexes present in act viewer page is 1
    And user can see the delete button on actions menu
    And user can click on delete the annex from the actview page
    Then one Annex deletion dialogue box will be displayed
    And user can delete the annex

  @skip
  @verifyReorderFunctionalityFromAnnex @local
  Scenario: ReorderFunctionality
    When click on add button in annexes section
    Then total number of annexes present in act viewer page is 1
    When click on add button in annexes section
    Then total number of annexes present in act viewer page is 2
    And user can change the name of the annex by click the actions button
    When user click on Title change from actions menu
    Then one Edit title dialogue box will be displayed
    And user can clear the previous title
    And the user can change title of the annex to "Annex1"
    And user can save the changes
    When the user clicks on the Reorder button
    Then user should be to see Edit Annex order dialogue box
    And user can do the drag and drop drop the annex from  the dialogue box
    And user can close the button from the edit annex order
