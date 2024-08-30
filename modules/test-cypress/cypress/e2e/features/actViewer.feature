#Author: Satyabrata Das
#Keywords Summary : Testing different functionalities in act viewer page in drafting instance

@ProposalViewerScenarios
Feature: act viewer page Regression Features

    Background:
        Given navigate to edit drafting application with "User1"
        Then user is on home page

    @createMilestone @local
    Scenario: verify that user is able to create milestone
        When click on Create act button
        Then user is on create new legislative document window
        When click on template "SJ-023" in create new legislative document window
        When click on next button in create document page
        And  provide document title "Automation Testing" in create document page
        And  click on create button
        Then user is on act viewer page
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
        When click on Create act button
        Then user is on create new legislative document window
        When click on template "SJ-023" in create new legislative document window
        When click on next button in create document page
        And  provide document title "Automation Testing" in create document page
        And  click on create button
        Then user is on act viewer page
        When click on add button in annexes section
        Then total number of annexes present in act viewer page is 1
        When click on add button in annexes section
        Then total number of annexes present in act viewer page is 2
        When click on actions button
        And  click on download button
        And  extract recent "zip" file present in download folder
        And  extract recent "leg" file present in download folder
        Then xml files having separator "-" present in download folder contain below names
            | fileName        |
            | ANNEX           |
            | ANNEX           |
            | EXPL_MEMORANDUM |
            | main            |
            | REG             |

